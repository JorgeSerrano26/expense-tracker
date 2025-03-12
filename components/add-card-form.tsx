"use client"

import type React from "react"

import { CardBrandSelector } from "@/app/cards/new/components/CardBrandSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardBrand } from "@/services/Card"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from 'sonner'

type Props = {
  brands: CardBrand[]
}

export function AddCardForm({ brands }: Props) {
  const router = useRouter()
  const [cardType, setCardType] = useState("")
  const [cardBrand, setBrand] = useState("")


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Get form data
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    console.log(formData.get("name"))

    toast.success("Card added", {
      duration: 3000,
      description: "Your payment card has been successfully added.",
    })

    //router.push("/cards")
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


            <CardBrandSelector brands={brands} setCardType={setBrand} />


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
                <Label htmlFor="card-type">Tipo de tarjeta</Label>
                <Select onValueChange={setCardType} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="brand-credit"
                      value="credit">Tarjeta de credito
                    </SelectItem>
                    <SelectItem key="brand-debit"
                      value="debit">Tarjeta de debito
                    </SelectItem>
                  </SelectContent>
                </Select>
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
    </form >
  )
}

