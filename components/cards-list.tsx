import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Card as CardService } from "@/services/Card"
import { CreditCard, Edit, MoreHorizontal, Trash } from "lucide-react"

export async function CardsList() {
  const cards = await CardService.getCards()

  const getExpireDate = (expireDate: string) => {
    const date = new Date(expireDate)
    return `${date.getMonth() + 1}/${date.getFullYear()}`
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
                  <CardDescription className="text-white/80">**** **** **** {card.last_digits}</CardDescription>
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
                    <DropdownMenuItem>
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
                  <span className="text-sm text-muted-foreground">Expires: {getExpireDate(card.expire_date)}</span>
                </div>
                <div className="flex gap-2">
                  <Badge className="capitalize" color={card.color}>
                    {card.currencies.code}
                  </Badge>
                  <Badge variant="outline" className={cn("capitalize", card.color)}>
                    {card.card_brands.name}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

