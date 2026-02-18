"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Loader2,
  Banknote,
  CreditCard as CreditCardIcon,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expense-form";
import { deleteExpense } from "@/app/actions";
import { CARD_TYPE_CONFIG, PAYMENT_METHOD_LABELS } from "@/lib/card-styles";
import { CURRENCY_SYMBOLS } from "@/lib/validations";
import type { PaymentMethod, CardType, Currency } from "@/lib/validations";

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
  card: {
    id: string;
    bank: string;
    lastFourDigits: string;
    type: CardType;
  } | null;
  date: string;
  createdAt: string;
  updatedAt: string;
};

type ExpenseTableProps = {
  expenses: Expense[];
  isLoading: boolean;
  onMutationSuccess: () => void;
};

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

const PAYMENT_ICONS: Record<PaymentMethod, typeof Banknote> = {
  CASH: Banknote,
  CARD: CreditCardIcon,
  TRANSFER: ArrowLeftRight,
};

function PaymentBadge({ expense }: { expense: Expense }) {
  const Icon = PAYMENT_ICONS[expense.paymentMethod];

  if (expense.paymentMethod === "CARD" && expense.card) {
    const config = CARD_TYPE_CONFIG[expense.card.type];
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[11px] font-medium text-white",
          config.gradient
        )}
      >
        <CreditCardIcon className="h-3 w-3" />
        •••• {expense.card.lastFourDigits}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium">
      <Icon className="h-3 w-3" />
      {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
    </span>
  );
}

export function ExpenseTable({
  expenses,
  isLoading,
  onMutationSuccess,
}: ExpenseTableProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDeletePending, startDeleteTransition] = useTransition();

  function handleDelete(id: string) {
    startDeleteTransition(async () => {
      try {
        await deleteExpense(id);
        onMutationSuccess();
        toast.success("Gasto eliminado");
      } catch {
        toast.error("Error al eliminar el gasto");
      }
    });
  }

  function handleEditSuccess() {
    setEditingExpense(null);
    onMutationSuccess();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando gastos...
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg">No hay gastos registrados este mes</p>
        <p className="text-sm">Agregá un gasto para comenzar</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Moneda</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="whitespace-nowrap">
                  {dateFormatter.format(new Date(expense.date))}
                </TableCell>
                <TableCell>
                  <div>
                    {expense.description}
                    {expense.note && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {expense.note}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    {expense.category.name}
                  </span>
                </TableCell>
                <TableCell>
                  <PaymentBadge expense={expense} />
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">
                    {CURRENCY_SYMBOLS[expense.currency]} {expense.currency}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatAmount(expense.amount, expense.currency)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingExpense(expense)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(expense.id)}
                      disabled={isDeletePending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!editingExpense}
        onOpenChange={(open) => !open && setEditingExpense(null)}
      >
        <DialogContent>
          <ExpenseForm
            expense={editingExpense}
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
