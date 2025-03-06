import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoansList } from "@/components/loans-list"

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">Track loans in different currencies</p>
        </div>
        <Link href="/loans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Loan
          </Button>
        </Link>
      </div>
      <LoansList />
    </div>
  )
}

