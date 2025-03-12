import { AddCardForm } from "@/components/add-card-form";
import { Card } from "@/services/Card";

export default async function AddCardPage() {
  const brands = await Card.getBrands()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Payment Card</h1>
        <p className="text-muted-foreground">Add a new payment card to track your expenses</p>
      </div>
      <AddCardForm brands={brands} />
    </div>
  )
}

