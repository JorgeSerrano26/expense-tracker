import { AddCardForm } from "@/components/add-card-form"

export default function AddCardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Payment Card</h1>
        <p className="text-muted-foreground">Add a new payment card to track your expenses</p>
      </div>
      <AddCardForm />
    </div>
  )
}

