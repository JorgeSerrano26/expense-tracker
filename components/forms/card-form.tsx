"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cardSchema, type CardFormData } from "@/lib/types"

interface CardFormProps {
  initialData?: Partial<CardFormData> & { id?: string }
  onSubmit: (data: CardFormData) => void
  onCancel: () => void
}

const cardColors = [
  { value: "#3B82F6", label: "Blue", class: "bg-blue-500" },
  { value: "#10B981", label: "Green", class: "bg-green-500" },
  { value: "#F59E0B", label: "Yellow", class: "bg-yellow-500" },
  { value: "#EF4444", label: "Red", class: "bg-red-500" },
  { value: "#8B5CF6", label: "Purple", class: "bg-purple-500" },
  { value: "#F97316", label: "Orange", class: "bg-orange-500" },
  { value: "#06B6D4", label: "Cyan", class: "bg-cyan-500" },
  { value: "#84CC16", label: "Lime", class: "bg-lime-500" },
]

export function CardForm({ initialData, onSubmit, onCancel }: CardFormProps) {
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: initialData?.name || "",
      lastFour: initialData?.lastFour || "",
      type: initialData?.type || "CREDIT",
      color: initialData?.color || "#3B82F6",
    },
  })

  const handleSubmit = (data: CardFormData) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Main Credit Card" {...field} />
              </FormControl>
              <FormDescription>
                A friendly name to identify this card
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastFour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last 4 Digits</FormLabel>
              <FormControl>
                <Input 
                  placeholder="1234" 
                  maxLength={4}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    field.onChange(value)
                  }}
                />
              </FormControl>
              <FormDescription>
                Last 4 digits of your card number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CREDIT">Credit Card</SelectItem>
                  <SelectItem value="DEBIT">Debit Card</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Type of payment method
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Color</FormLabel>
              <FormControl>
                <div className="grid grid-cols-4 gap-2">
                  {cardColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`
                        w-12 h-12 rounded-lg border-2 transition-all
                        ${color.class}
                        ${field.value === color.value 
                          ? 'border-gray-900 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                      onClick={() => field.onChange(color.value)}
                      title={color.label}
                    />
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Choose a color to identify your card
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? "Update Card" : "Add Card"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
