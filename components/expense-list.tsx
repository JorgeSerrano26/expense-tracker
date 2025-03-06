"use client"

import { useState } from "react"
import { Check, CreditCard, MoreHorizontal, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface ExpenseListProps {
  selectedDate: Date
  filter?: string
}

export function ExpenseList({ selectedDate, filter = "all" }: ExpenseListProps) {
  // This would normally come from your database
  const [expenses, setExpenses] = useState([
    {
      id: "1",
      description: "Groceries at Carrefour",
      amount: 2500,
      date: "2023-06-15",
      paymentMethod: "card",
      cardName: "Visa Galicia",
      isShared: false,
      installments: { total: 1, paid: 1 },
    },
    {
      id: "2",
      description: "Dinner with friends",
      amount: 1800,
      date: "2023-06-12",
      paymentMethod: "cash",
      isShared: true,
      sharedWith: ["Juan", "Maria"],
      splitType: "equal",
    },
    {
      id: "3",
      description: "Netflix subscription",
      amount: 1200,
      date: "2023-06-10",
      paymentMethod: "card",
      cardName: "Mastercard BBVA",
      isShared: false,
      installments: { total: 1, paid: 1 },
    },
    {
      id: "4",
      description: "Transfer to Mom",
      amount: 5000,
      date: "2023-06-05",
      paymentMethod: "transfer",
      recipient: "Mom",
      isShared: false,
    },
    {
      id: "5",
      description: "New headphones",
      amount: 8000,
      date: "2023-06-01",
      paymentMethod: "card",
      cardName: "Visa Galicia",
      isShared: false,
      installments: { total: 3, paid: 1 },
    },
  ])

  const filteredExpenses = filter === "all" ? expenses : expenses.filter((expense) => expense.paymentMethod === filter)

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "cash":
      case "transfer":
        return <Wallet className="h-4 w-4" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const markInstallmentPaid = (expenseId: string) => {
    setExpenses(
      expenses.map((expense) => {
        if (expense.id === expenseId && expense.installments) {
          return {
            ...expense,
            installments: {
              ...expense.installments,
              paid: Math.min(expense.installments.paid + 1, expense.installments.total),
            },
          }
        }
        return expense
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>
          Your latest expenses for {selectedDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No expenses found</p>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-full">{getPaymentIcon(expense.paymentMethod)}</div>
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.date)}
                      {expense.cardName && ` • ${expense.cardName}`}
                      {expense.isShared && " • Shared"}
                      {expense.installments &&
                        expense.installments.total > 1 &&
                        ` • Installment ${expense.installments.paid}/${expense.installments.total}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {expense.isShared && (
                    <Badge variant="outline" className="mr-2">
                      Shared
                    </Badge>
                  )}
                  <div className="text-right font-medium">{formatCurrency(expense.amount)}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit expense</DropdownMenuItem>
                      <DropdownMenuItem>Delete expense</DropdownMenuItem>
                      {expense.installments && expense.installments.paid < expense.installments.total && (
                        <DropdownMenuItem onClick={() => markInstallmentPaid(expense.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Mark installment paid
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

