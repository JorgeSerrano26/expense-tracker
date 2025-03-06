"use client"

import { useState } from "react"
import { Check, Edit, MoreHorizontal, PiggyBank, Trash } from "lucide-react"
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

export function LoansList() {
  // This would normally come from your database
  const [loans, setLoans] = useState([
    {
      id: "1",
      description: "Loan to Juan",
      amount: 5000,
      currency: "ARS",
      date: "2023-05-15",
      dueDate: "2023-07-15",
      isPaid: false,
      type: "given", // given or received
    },
    {
      id: "2",
      description: "Rent advance",
      amount: 200,
      currency: "USD",
      date: "2023-06-01",
      dueDate: "2023-08-01",
      isPaid: false,
      type: "given",
    },
    {
      id: "3",
      description: "Borrowed from Maria",
      amount: 100,
      currency: "EUR",
      date: "2023-04-10",
      dueDate: "2023-06-10",
      isPaid: true,
      type: "received",
    },
  ])

  const markAsPaid = (id: string) => {
    setLoans(
      loans.map((loan) => {
        if (loan.id === id) {
          return { ...loan, isPaid: true }
        }
        return loan
      }),
    )
  }

  const deleteLoan = (id: string) => {
    setLoans(loans.filter((loan) => loan.id !== id))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {loans.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No loans added yet</p>
          </CardContent>
        </Card>
      ) : (
        loans.map((loan) => (
          <Card key={loan.id} className={loan.isPaid ? "opacity-70" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{loan.description}</CardTitle>
                  <CardDescription>
                    {loan.type === "given" ? "Lent to someone" : "Borrowed from someone"}
                  </CardDescription>
                </div>
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
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit loan
                    </DropdownMenuItem>
                    {!loan.isPaid && (
                      <DropdownMenuItem onClick={() => markAsPaid(loan.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as paid
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => deleteLoan(loan.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete loan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <PiggyBank className="mr-2 h-4 w-4" />
                    <span className="text-sm text-muted-foreground">{formatDate(loan.date)}</span>
                  </div>
                  <Badge variant={loan.isPaid ? "outline" : "default"}>{loan.isPaid ? "Paid" : "Pending"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Due date</p>
                    <p>{formatDate(loan.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-bold">{formatCurrency(loan.amount, loan.currency)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

