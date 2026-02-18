"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CURRENCY_SYMBOLS } from "@/lib/validations";
import type { Currency } from "@/lib/validations";
import type { Expense } from "@/lib/hooks";

type ExpenseDashboardProps = {
  expenses: Expense[];
  isLoading: boolean;
  currencyFilter: Currency | "ALL";
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "oklch(0.55 0.15 250)",
  "oklch(0.65 0.18 150)",
  "oklch(0.70 0.16 50)",
  "oklch(0.60 0.20 330)",
  "oklch(0.75 0.12 200)",
];

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

function CustomTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { percent: number } }>;
  currency: Currency;
}) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: data } = payload[0];
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{name}</p>
      <p className="text-muted-foreground">
        {formatAmount(value, currency)} ({(data.percent * 100).toFixed(1)}%)
      </p>
    </div>
  );
}

export function ExpenseDashboard({ expenses, isLoading, currencyFilter }: ExpenseDashboardProps) {
  const { chartData, totalsByCurrency, displayCurrency } = useMemo(() => {
    const byCategory = new Map<string, { name: string; amount: number }>();
    const totals = new Map<Currency, number>();
    let sum = 0;

    for (const expense of expenses) {
      sum += expense.amount;
      totals.set(expense.currency, (totals.get(expense.currency) ?? 0) + expense.amount);

      const existing = byCategory.get(expense.categoryId);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        byCategory.set(expense.categoryId, {
          name: expense.category.name,
          amount: expense.amount,
        });
      }
    }

    const entries = Array.from(byCategory.values())
      .sort((a, b) => b.amount - a.amount)
      .map((entry) => ({
        ...entry,
        percent: sum > 0 ? entry.amount / sum : 0,
      }));

    const resolvedCurrency: Currency =
      currencyFilter !== "ALL" ? currencyFilter : "ARS";

    return {
      chartData: entries,
      totalsByCurrency: totals,
      displayCurrency: resolvedCurrency,
    };
  }, [expenses, currencyFilter]);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          Cargando resumen...
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <p className="text-lg">No hay gastos en el período</p>
        </div>
      </div>
    );
  }

  const showMultipleTotals = currencyFilter === "ALL" && totalsByCurrency.size > 1;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="mx-auto h-[200px] w-[200px] shrink-0 sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="amount"
                nameKey="name"
                strokeWidth={0}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip currency={displayCurrency} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Total del período</p>
            {showMultipleTotals ? (
              <div className="space-y-1 pt-1">
                {Array.from(totalsByCurrency.entries())
                  .sort(([, a], [, b]) => b - a)
                  .map(([cur, amount]) => (
                    <p key={cur} className="text-xl font-bold tracking-tight">
                      {CURRENCY_SYMBOLS[cur]} {formatAmount(amount, cur)}
                    </p>
                  ))}
              </div>
            ) : (
              <p className="text-3xl font-bold tracking-tight">
                {formatAmount(
                  totalsByCurrency.get(displayCurrency) ?? 0,
                  displayCurrency
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            {chartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{entry.name}</span>
                </div>
                <span className="font-medium tabular-nums">
                  {formatAmount(entry.amount, displayCurrency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
