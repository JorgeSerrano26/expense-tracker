import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardsList } from "@/components/cards-list"

export default function CardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Cards</h1>
          <p className="text-muted-foreground">Manage your payment cards for expense tracking</p>
        </div>
        <Link href="/cards/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </Link>
      </div>
      <CardsList />
    </div>
  )
}

