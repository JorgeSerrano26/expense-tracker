"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export function AddLoanForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally save the loan to your database

    toast({
      title: "Loan added",
      description: "Your loan has been successfully recorded.",
    })

    router.push("/loans")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="What is this loan for?" required />
            </div>

            <div className="grid gap-3">
              <Label>Loan Type</Label>
              <RadioGroup defaultValue="given">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="given" id="given" />
                  <Label htmlFor="given">Money I lent to someone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="received" id="received" />
                  <Label htmlFor="received">Money I borrowed from someone</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="person">Person</Label>
              <Input id="person" placeholder="Who is involved in this loan?" required />
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
              <Label htmlFor="date">Loan Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date" variant="outline" className="w-full justify-start text-left font-normal">
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
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="dueDate" variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? dueDate.toLocaleDateString("es-AR") : <span>Pick a due date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any additional details about this loan" />
            </div>

            <Button type="submit" className="w-full">
              Save Loan
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

