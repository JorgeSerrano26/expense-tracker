"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Banknote, CreditCard, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createSubscription, updateSubscription } from "@/app/actions";
import {
  createSubscriptionSchema,
  CURRENCIES,
  CURRENCY_LABELS,
  BILLING_CYCLES,
  BILLING_CYCLE_LABELS,
} from "@/lib/validations";
import { useCards } from "@/lib/hooks";
import { CARD_TYPE_CONFIG } from "@/lib/card-styles";
import type { PaymentMethod, Currency, BillingCycle } from "@/lib/validations";

type SubscriptionData = {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingDay: number;
  startDate: string;
  endDate: string | null;
  paymentMethod: PaymentMethod;
  cardId: string | null;
};

type SubscriptionFormProps = {
  subscription?: SubscriptionData | null;
  onSuccess: () => void;
};

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  icon: typeof Banknote;
}[] = [
  { value: "CASH", label: "Efectivo", icon: Banknote },
  { value: "CARD", label: "Tarjeta", icon: CreditCard },
  { value: "TRANSFER", label: "Transferencia", icon: ArrowLeftRight },
];

export function SubscriptionForm({ subscription, onSuccess }: SubscriptionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [currency, setCurrency] = useState<Currency>(
    subscription?.currency ?? "ARS"
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    subscription?.billingCycle ?? "MONTHLY"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    subscription?.paymentMethod ?? "CARD"
  );
  const [selectedCard, setSelectedCard] = useState<string>(
    subscription?.cardId ?? ""
  );

  const { data: cards = [] } = useCards();
  const isEditing = !!subscription;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const raw = {
      name: formData.get("name") as string,
      amount: parseFloat(formData.get("amount") as string),
      currency,
      billingCycle,
      billingDay: parseInt(formData.get("billingDay") as string, 10),
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || null,
      paymentMethod,
      cardId: paymentMethod === "CARD" ? selectedCard || null : null,
    };

    const parsed = createSubscriptionSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateSubscription(subscription.id, parsed.data);
          toast.success("Suscripción actualizada");
        } else {
          await createSubscription(parsed.data);
          toast.success("Suscripción creada");
        }
        onSuccess();
      } catch {
        toast.error("Error al guardar la suscripción");
      }
    });
  }

  const defaultStartDate = subscription
    ? new Date(subscription.startDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const defaultEndDate = subscription?.endDate
    ? new Date(subscription.endDate).toISOString().split("T")[0]
    : "";

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar suscripción" : "Nueva suscripción"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Modificá los datos de la suscripción. Los próximos gastos usarán los nuevos valores."
            : "Configurá una suscripción recurrente. Se creará un gasto automático en cada período."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="sub-name">Nombre</Label>
          <Input
            id="sub-name"
            name="name"
            placeholder="Ej: Netflix, Spotify"
            defaultValue={subscription?.name ?? ""}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sub-amount">Monto</Label>
            <div className="flex gap-2">
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger className="w-[100px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CURRENCY_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="sub-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={subscription?.amount ?? ""}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Ciclo</Label>
            <div className="grid grid-cols-2 gap-2">
              {BILLING_CYCLES.map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                    billingCycle === cycle
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {BILLING_CYCLE_LABELS[cycle]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sub-billingDay">Día de cobro</Label>
            <Input
              id="sub-billingDay"
              name="billingDay"
              type="number"
              min="1"
              max="31"
              defaultValue={subscription?.billingDay ?? 1}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub-startDate">Inicio</Label>
            <Input
              id="sub-startDate"
              name="startDate"
              type="date"
              defaultValue={defaultStartDate}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub-endDate">Fin (opcional)</Label>
            <Input
              id="sub-endDate"
              name="endDate"
              type="date"
              defaultValue={defaultEndDate}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Método de pago</Label>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPaymentMethod(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors",
                    paymentMethod === opt.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {paymentMethod === "CARD" && (
          <div className="grid gap-2">
            <Label>Tarjeta</Label>
            {cards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tenés tarjetas cargadas.{" "}
                <a href="/tarjetas" className="text-primary underline">
                  Agregar una tarjeta
                </a>
              </p>
            ) : (
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tarjeta" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-block h-3 w-3 rounded-full bg-gradient-to-r",
                            CARD_TYPE_CONFIG[card.type].gradient
                          )}
                        />
                        {CARD_TYPE_CONFIG[card.type].label} ••••{" "}
                        {card.lastFourDigits}
                        <span className="text-muted-foreground">
                          ({card.bank})
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear suscripción"}
        </Button>
      </DialogFooter>
    </form>
  );
}
