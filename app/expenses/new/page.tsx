import { AddExpenseForm } from "@/components/add-expense-form"

export default function AddExpensePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
        <p className="text-muted-foreground">Record a new expense, transfer, or shared payment</p>
      </div>
      <AddExpenseForm />
    </div>
  )
}

