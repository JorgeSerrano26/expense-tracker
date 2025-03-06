"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, CreditCard, Plus, Trash, Users, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export function AddExpenseForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [isShared, setIsShared] = useState(false)
  const [splitType, setSplitType] = useState("equal")
  const [participants, setParticipants] = useState<{ name: string; amount?: number }[]>([{ name: "" }])
  const [isInstallment, setIsInstallment] = useState(false)
  const [installments, setInstallments] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")

  // This would normally come from your database
  const cards = [
    { id: "1", name: "Visa Galicia", lastDigits: "1234" },
    { id: "2", name: "Mastercard BBVA", lastDigits: "5678" },
    { id: "3", name: "American Express", lastDigits: "9012" },
  ]

  const addParticipant = () => {
    setParticipants([...participants, { name: "" }])
  }

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const newParticipants = [...participants]
      newParticipants.splice(index, 1)
      setParticipants(newParticipants)
    }
  }

  const updateParticipant = (index: number, field: string, value: string) => {
    const newParticipants = [...participants]
    if (field === "name") {
      newParticipants[index].name = value
    } else if (field === "amount") {
      newParticipants[index].amount = Number.parseFloat(value) || 0
    }
    setParticipants(newParticipants)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally save the expense to your database

    toast({
      title: "Expense added",
      description: "Your expense has been successfully recorded.",
    })

    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="What was this expense for?" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center gap-2">
                <Select defaultValue="ARS">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARS">ARS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="amount" type="number" placeholder="0.00" step="0.01" min="0" required />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString("es-AR") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-3">
              <Label>Payment Method</Label>
              <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    Card
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                  <Label
                    htmlFor="cash"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Wallet className="mb-3 h-6 w-6" />
                    Cash
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="transfer" id="transfer" className="peer sr-only" />
                  <Label
                    htmlFor="transfer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Users className="mb-3 h-6 w-6" />
                    Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "card" && (
              <div className="grid gap-3">
                <Label htmlFor="card">Select Card</Label>
                <Select>
                  <SelectTrigger id="card">
                    <SelectValue placeholder="Select a card" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name} (*{card.lastDigits})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {paymentMethod === "transfer" && (
              <div className="grid gap-3">
                <Label htmlFor="recipient">Recipient</Label>
                <Input id="recipient" placeholder="Who did you transfer to?" required />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch id="installments" checked={isInstallment} onCheckedChange={setIsInstallment} />
              <Label htmlFor="installments">Pay in installments</Label>
            </div>

            {isInstallment && (
              <div className="grid gap-3">
                <Label htmlFor="installment-count">Number of Installments</Label>
                <Input
                  id="installment-count"
                  type="number"
                  min="2"
                  max="24"
                  value={installments}
                  onChange={(e) => setInstallments(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch id="shared" checked={isShared} onCheckedChange={setIsShared} />
              <Label htmlFor="shared">Shared expense</Label>
            </div>

            {isShared && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label>Split Type</Label>
                  <RadioGroup defaultValue="equal" onValueChange={setSplitType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal" id="equal" />
                      <Label htmlFor="equal">Equal split</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Custom amounts</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Participants</Label>
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Name"
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, "name", e.target.value)}
                        required
                      />
                      {splitType === "custom" && (
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={participant.amount || ""}
                          onChange={(e) => updateParticipant(index, "amount", e.target.value)}
                          required={splitType === "custom"}
                        />
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeParticipant(index)}
                        disabled={participants.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addParticipant}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Participant
                  </Button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              Save Expense
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

