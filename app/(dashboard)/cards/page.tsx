"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Mock data - replace with actual API calls
const mockCards = [
  {
    id: "1",
    name: "Main Credit Card",
    lastFour: "4532",
    type: "CREDIT" as const,
    color: "#3B82F6",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Debit Card",
    lastFour: "8901",
    type: "DEBIT" as const,
    color: "#10B981",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Cash Wallet",
    lastFour: "0000",
    type: "CASH" as const,
    color: "#F59E0B",
    createdAt: "2024-01-01",
  },
]

export default function CardsPage() {
  const [cards, setCards] = useState(mockCards)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<typeof mockCards[0] | null>(null)

  const handleAddCard = (cardData: any) => {
    const newCard = {
      id: Date.now().toString(),
      ...cardData,
      createdAt: new Date().toISOString(),
    }
    setCards([...cards, newCard])
    setIsDialogOpen(false)
    toast.success("Card added successfully!")
  }

  const handleEditCard = (cardData: any) => {
    setCards(cards.map(card => 
      card.id === editingCard?.id 
        ? { ...card, ...cardData }
        : card
    ))
    setEditingCard(null)
    setIsDialogOpen(false)
    toast.success("Card updated successfully!")
  }

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId))
    toast.success("Card deleted successfully!")
  }

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case "CREDIT":
        return Icons.card
      case "DEBIT":
        return Icons.card
      case "CASH":
        return Icons.dollar
      default:
        return Icons.card
    }
  }

  const getCardTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "CREDIT":
        return "default"
      case "DEBIT":
        return "secondary"
      case "CASH":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cards</h1>
          <p className="text-gray-600">Manage your payment methods</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCard(null)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
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
              initialData={editingCard}
              onSubmit={editingCard ? handleEditCard : handleAddCard}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingCard(null)
              }}
            />
          </DialogContent>
        </Dialog>
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
        
        {/* Add Card Placeholder */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-48 text-gray-500">
            <Icons.plus className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium mb-2">Add New Card</p>
            <p className="text-sm text-center">
              Add a payment method to track expenses
            </p>
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => {
                setEditingCard(null)
                setIsDialogOpen(true)
              }}
            >
              Add Card
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cards.filter(card => card.type === "CREDIT").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Debit Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cards.filter(card => card.type === "DEBIT").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
