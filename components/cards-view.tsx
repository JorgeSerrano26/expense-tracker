"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreditCard } from "@/components/credit-card";
import { CardForm } from "@/components/card-form";
import { useCards, useDeleteCard } from "@/lib/hooks";
import type { Card } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";

export function CardsView() {
  const { data: cards = [], isLoading } = useCards();
  const deleteMutation = useDeleteCard();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  function handleFormSuccess() {
    setShowForm(false);
    setEditingCard(null);
    queryClient.invalidateQueries({ queryKey: ["cards"] });
  }

  function handleDelete(card: Card) {
    deleteMutation.mutate(card.id, {
      onSuccess: () => toast.success("Tarjeta eliminada"),
      onError: (err) => toast.error(err.message),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando tarjetas...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar tarjeta
        </Button>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-lg">No tenés tarjetas cargadas</p>
          <p className="text-sm">Agregá una tarjeta para comenzar</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map((card) => (
            <div key={card.id} className="group relative">
              <CreditCard
                bank={card.bank}
                lastFourDigits={card.lastFourDigits}
                expirationMonth={card.expirationMonth}
                expirationYear={card.expirationYear}
                type={card.type}
                className="w-full max-w-none transition-transform group-hover:scale-[1.02]"
              />
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  onClick={() => setEditingCard(card)}
                >
                  <Pencil className="h-4 w-4 text-white" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-red-500/60"
                  onClick={() => handleDelete(card)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <CardForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingCard}
        onOpenChange={(open) => !open && setEditingCard(null)}
      >
        <DialogContent>
          <CardForm card={editingCard} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
