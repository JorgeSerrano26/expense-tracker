"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Banknote, CreditCard, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { CategoryCombobox } from "@/components/category-combobox";
import { createExpense, updateExpense } from "@/app/actions";
import { createExpenseSchema, CURRENCIES, CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/lib/validations";
import { useCards } from "@/lib/hooks";
import { CARD_TYPE_CONFIG } from "@/lib/card-styles";
import type { PaymentMethod, Currency } from "@/lib/validations";

type Expense = {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  note?: string | null;
  categoryId: string;
  category: { id: string; name: string };
  paymentMethod: PaymentMethod;
  cardId: string | null;
  date: string;
};

type ExpenseFormProps = {
  expense?: Expense | null;
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

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    expense?.categoryId ?? ""
  );
  const [currency, setCurrency] = useState<Currency>(
    expense?.currency ?? "ARS"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    expense?.paymentMethod ?? "CASH"
  );
  const [selectedCard, setSelectedCard] = useState<string>(
    expense?.cardId ?? ""
  );

  const [installments, setInstallments] = useState<number>(1);
  const [amount, setAmount] = useState<string>(
    expense?.amount?.toString() ?? ""
  );
  const [note, setNote] = useState<string>(expense?.note ?? "");

  const { data: cards = [] } = useCards();
  const isEditing = !!expense;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const raw = {
      description: formData.get("description") as string,
      amount: parseFloat(amount),
      currency,
      categoryId: selectedCategory,
      date: formData.get("date") as string,
      paymentMethod,
      cardId: paymentMethod === "CARD" ? selectedCard || null : null,
      note: note.trim() || null,
      installments: isEditing ? 1 : installments,
    };

    const parsed = createExpenseSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateExpense(expense.id, parsed.data);
          toast.success("Gasto actualizado");
        } else {
          await createExpense(parsed.data);
          toast.success("Gasto agregado");
        }
        onSuccess();
      } catch {
        toast.error("Error al guardar el gasto");
      }
    });
  }

  const defaultDate = expense
    ? new Date(expense.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar gasto" : "Agregar gasto"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Modificá los datos del gasto."
            : "Completá los datos para registrar un nuevo gasto."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            name="description"
            placeholder="Ej: Supermercado"
            defaultValue={expense?.description ?? ""}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Monto</Label>
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
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={defaultDate}
              required
            />
          </div>
        </div>

        {!isEditing && (
          <div className="grid gap-2">
            <Label htmlFor="installments">Cuotas</Label>
            <div className="flex items-center gap-2">
              <Input
                id="installments"
                type="number"
                min="1"
                max="48"
                value={installments}
                onChange={(e) => setInstallments(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24"
              />
              {installments > 1 && parseFloat(amount) > 0 && (
                <span className="text-sm text-muted-foreground">
                  {installments} cuotas de{" "}
                  {CURRENCY_SYMBOLS[currency]}
                  {(parseFloat(amount) / installments).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <Label>Categoría</Label>
          <CategoryCombobox
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
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

        <div className="grid gap-2">
          <Label htmlFor="note">Comentario (opcional)</Label>
          <Textarea
            id="note"
            placeholder="Ej: Compra en 10 cuotas sin interés"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>

        
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Agregar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
