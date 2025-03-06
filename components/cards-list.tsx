"use client"

import { useState } from "react"
import { CreditCard, Edit, MoreHorizontal, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function CardsList() {
  // This would normally come from your database
  const [cards, setCards] = useState([
    {
      id: "1",
      name: "Visa Galicia",
      type: "visa",
      lastDigits: "1234",
      expiryDate: "12/25",
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Mastercard BBVA",
      type: "mastercard",
      lastDigits: "5678",
      expiryDate: "06/24",
      color: "bg-red-500",
    },
    {
      id: "3",
      name: "American Express",
      type: "amex",
      lastDigits: "9012",
      expiryDate: "03/26",
      color: "bg-green-500",
    },
  ])

  const deleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No cards added yet</p>
          </CardContent>
        </Card>
      ) : (
        cards.map((card) => (
          <Card key={card.id}>
            <CardHeader className={`${card.color} text-white rounded-t-lg`}>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{card.name}</CardTitle>
                  <CardDescription className="text-white/80">**** **** **** {card.lastDigits}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit card
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteCard(card.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete card
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Expires: {card.expiryDate}</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {card.type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

