"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SubscriptionForm } from "@/components/subscription-form";
import {
  useSubscriptions,
  useToggleSubscription,
  useDeleteSubscription,
  type Subscription,
} from "@/lib/hooks";
import { BILLING_CYCLE_LABELS, CURRENCY_SYMBOLS } from "@/lib/validations";
import type { Currency, BillingCycle } from "@/lib/validations";

const CURRENCY_LOCALE: Record<Currency, string> = {
  ARS: "es-AR",
  USD: "en-US",
  EUR: "de-DE",
  BRL: "pt-BR",
};

function formatAmount(amount: number, currency: Currency) {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
  }).format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function SubscriptionCard({
  sub,
  onEdit,
}: {
  sub: Subscription;
  onEdit: (s: Subscription) => void;
}) {
  const toggleMutation = useToggleSubscription();
  const deleteMutation = useDeleteSubscription();

  function handleToggle() {
    toggleMutation.mutate(
      { id: sub.id, active: !sub.active },
      {
        onSuccess: () =>
          toast.success(sub.active ? "Suscripción pausada" : "Suscripción reactivada"),
        onError: () => toast.error("Error al cambiar el estado"),
      }
    );
  }

  function handleDelete() {
    deleteMutation.mutate(sub.id, {
      onSuccess: () => toast.success(`"${sub.name}" eliminada`),
      onError: (err) => toast.error(err.message),
    });
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 transition-opacity",
        !sub.active && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold truncate">{sub.name}</h3>
            {!sub.active && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Pausada
              </span>
            )}
          </div>
          <p className="mt-1 text-lg font-bold">
            {formatAmount(sub.amount, sub.currency as Currency)}
            <span className="text-sm font-normal text-muted-foreground">
              {BILLING_CYCLE_LABELS[sub.billingCycle as BillingCycle]}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={handleToggle}
            disabled={toggleMutation.isPending}
          >
            {sub.active ? "Pausar" : "Activar"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(sub)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">
          {sub.category.name}
        </span>
        <span>Día de cobro: {sub.billingDay}</span>
        <span>·</span>
        <span>Próximo: {dateFormatter.format(new Date(sub.nextBillingDate))}</span>
        {sub.endDate && (
          <>
            <span>·</span>
            <span>Finaliza: {dateFormatter.format(new Date(sub.endDate))}</span>
          </>
        )}
      </div>
    </div>
  );
}

export function SubscriptionsView() {
  const { data: subscriptions = [], isLoading } = useSubscriptions();
  const [showForm, setShowForm] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  function handleFormSuccess() {
    setShowForm(false);
    setEditingSub(null);
  }

  function openEdit(sub: Subscription) {
    setEditingSub(sub);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando suscripciones...
      </div>
    );
  }

  const active = subscriptions.filter((s) => s.active);
  const paused = subscriptions.filter((s) => !s.active);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva suscripción
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-lg">No tenés suscripciones</p>
          <p className="text-sm">Agregá una suscripción para generar gastos automáticos</p>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Activas ({active.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {active.map((sub) => (
                  <SubscriptionCard key={sub.id} sub={sub} onEdit={openEdit} />
                ))}
              </div>
            </div>
          )}

          {paused.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Pausadas ({paused.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {paused.map((sub) => (
                  <SubscriptionCard key={sub.id} sub={sub} onEdit={openEdit} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <SubscriptionForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingSub}
        onOpenChange={(open) => !open && setEditingSub(null)}
      >
        <DialogContent>
          <SubscriptionForm
            subscription={
              editingSub
                ? {
                    id: editingSub.id,
                    name: editingSub.name,
                    amount: editingSub.amount,
                    currency: editingSub.currency,
                    billingCycle: editingSub.billingCycle,
                    billingDay: editingSub.billingDay,
                    startDate: editingSub.startDate,
                    endDate: editingSub.endDate,
                    paymentMethod: editingSub.paymentMethod,
                    cardId: editingSub.cardId,
                  }
                : null
            }
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
