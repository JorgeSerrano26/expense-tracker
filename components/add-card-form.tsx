"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export function AddCardForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [cardType, setCardType] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally save the card to your database

    toast({
      title: "Card added",
      description: "Your payment card has been successfully added.",
    })

    router.push("/cards")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Card Name</Label>
              <Input id="name" placeholder="e.g., Visa Galicia" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="type">Card Type</Label>
              <Select onValueChange={setCardType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="number">Card Number</Label>
              <Input id="number" placeholder="**** **** **** ****" required />
              <p className="text-xs text-muted-foreground">We only store the last 4 digits for security</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" type="password" placeholder="***" required />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="color">Card Color</Label>
              <Select defaultValue="bg-blue-500">
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select card color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-500">Blue</SelectItem>
                  <SelectItem value="bg-red-500">Red</SelectItem>
                  <SelectItem value="bg-green-500">Green</SelectItem>
                  <SelectItem value="bg-purple-500">Purple</SelectItem>
                  <SelectItem value="bg-orange-500">Orange</SelectItem>
                  <SelectItem value="bg-gray-500">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Add Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

