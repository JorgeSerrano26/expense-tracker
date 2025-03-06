import { AddLoanForm } from "@/components/add-loan-form"

export default function AddLoanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Loan</h1>
        <p className="text-muted-foreground">Record a new loan in any currency</p>
      </div>
      <AddLoanForm />
    </div>
  )
}

