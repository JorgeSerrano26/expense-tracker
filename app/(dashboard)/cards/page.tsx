"use client"

import { useState, type ComponentType } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CardForm } from "@/components/forms/card-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { CardFormData, CardType } from "@/lib/types"

// Local UI type to avoid bundling Prisma types in the client
type CardTypeValue = typeof CardType[keyof typeof CardType]
type UICard = {
  id: string
  name: string
  lastFour: string
  type: CardTypeValue
  color: string
  bank: string
  createdAt: Date
}

export default function CardsPage() {
  const [cards, setCards] = useState<UICard[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<UICard | null>(null)

  const handleAddCard = (cardData: CardFormData) => {
    const newCard: UICard = {
      id: crypto.randomUUID(),
      name: cardData.name,
      lastFour: cardData.lastFour,
      type: cardData.type as CardTypeValue,
      color: cardData.color,
      bank: cardData.bank,
      createdAt: new Date(),
    }
    setCards((prev) => [...prev, newCard])
    setIsDialogOpen(false)
    toast.success("Card added successfully!")
  }

  const handleEditCard = (cardData: CardFormData) => {
    if (!editingCard) return
    setCards((prev) =>
      prev.map((card) =>
        card.id === editingCard.id
          ? {
              ...card,
              name: cardData.name,
              lastFour: cardData.lastFour,
              type: cardData.type as CardTypeValue,
              color: cardData.color,
              bank: cardData.bank,
            }
          : card
      )
    )
    setEditingCard(null)
    setIsDialogOpen(false)
    toast.success("Card updated successfully!")
  }

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId))
    toast.success("Card deleted successfully!")
  }

  const getCardTypeIcon = (
    type: CardTypeValue
  ): ComponentType<{ className?: string }> => {
    switch (type) {
      case "CREDIT":
        return Icons.card
      case "DEBIT":
        return Icons.card
      case "CASH":
        return Icons.card
      default:
        return Icons.card
    }
  }

  const getCardTypeBadgeVariant = (
    type: CardTypeValue
  ): "default" | "secondary" => {
    switch (type) {
      case "CREDIT":
        return "default"
      case "DEBIT":
        return "secondary"
      case "CASH":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cards</h1>
          <p>Manage your payment methods</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const IconComponent = getCardTypeIcon(card.type)

          return (
            <Card key={card.id} className="relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-2"
                style={{ backgroundColor: card.color }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Icons.settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCard(card)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Icons.edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-red-600"
                      >
                        <Icons.trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last 4 digits</span>
                    <span className="font-mono text-lg">•••• {card.lastFour}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Type</span>
                    <Badge variant={getCardTypeBadgeVariant(card.type)}>
                      {card.type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Added</span>
                    <span className="text-sm">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="border-dashed border-2 border-gray-500 hover:border-white transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-48 text-gray-500 hover:text-white cursor-pointer">
                <Icons.plus className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium mb-2">Add New Card</p>
                <p className="text-sm text-center">
                  Add a payment method to track expenses
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCard ? "Edit Card" : "Add New Card"}
              </DialogTitle>
              <DialogDescription>
                {editingCard
                  ? "Update your card information below."
                  : "Add a new payment method to track your expenses."
                }
              </DialogDescription>
            </DialogHeader>
            <CardForm
              initialData={editingCard ?? undefined}
              onSubmit={editingCard ? handleEditCard : handleAddCard}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingCard(null)
              }}
            />
          </DialogContent>
        </Dialog>


      </div>
    </div>
  )
}

