"use client";

import { useMemo, useState } from "react";
import { Plus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseTable } from "@/components/expense-table";
import { ExpenseDashboard } from "@/components/expense-dashboard";
import { MonthPicker, type DateSelection } from "@/components/month-picker";
import { CategoryManager } from "@/components/category-manager";
import { useExpenses, useExpensesByRange } from "@/lib/hooks";
import { CURRENCIES, CURRENCY_SYMBOLS } from "@/lib/validations";
import type { Currency } from "@/lib/validations";
import { useQueryClient } from "@tanstack/react-query";

type ExpensesViewProps = {
  initialMonth: number;
  initialYear: number;
};

export function ExpensesView({ initialMonth, initialYear }: ExpensesViewProps) {
  const [selection, setSelection] = useState<DateSelection>({
    mode: "month",
    month: initialMonth,
    year: initialYear,
  });
  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [currencyFilter, setCurrencyFilter] = useState<Currency | "ALL">("ALL");

  const monthQuery = useExpenses(
    selection.mode === "month" ? selection.month : 0,
    selection.mode === "month" ? selection.year : 2000
  );

  const rangeQuery = useExpensesByRange(
    selection.mode === "range" ? selection.from : "",
    selection.mode === "range" ? selection.to : ""
  );

  const activeQuery = selection.mode === "month" ? monthQuery : rangeQuery;
  const allExpenses = activeQuery.data ?? [];
  const isLoading = activeQuery.isLoading;

  const filteredExpenses = useMemo(
    () =>
      currencyFilter === "ALL"
        ? allExpenses
        : allExpenses.filter((e) => e.currency === currencyFilter),
    [allExpenses, currencyFilter]
  );

  const queryClient = useQueryClient();

  function invalidateExpenses() {
    if (selection.mode === "month") {
      queryClient.invalidateQueries({
        queryKey: ["expenses", selection.month, selection.year],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ["expenses", "range", selection.from, selection.to],
      });
    }
  }

  function handleFormSuccess() {
    setShowForm(false);
    invalidateExpenses();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthPicker selection={selection} onChange={setSelection} />
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowCategories(true)}>
            <Tags className="mr-2 h-4 w-4" />
            Categorías
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar gasto
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Moneda:</span>
        <Select
          value={currencyFilter}
          onValueChange={(v) => setCurrencyFilter(v as Currency | "ALL")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas</SelectItem>
            {CURRENCIES.map((c) => (
              <SelectItem key={c} value={c}>
                {CURRENCY_SYMBOLS[c]} {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ExpenseDashboard
        expenses={filteredExpenses}
        isLoading={isLoading}
        currencyFilter={currencyFilter}
      />

      <ExpenseTable
        expenses={filteredExpenses}
        isLoading={isLoading}
        onMutationSuccess={invalidateExpenses}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <ExpenseForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <CategoryManager
        open={showCategories}
        onOpenChange={setShowCategories}
      />
    </div>
  );
}
