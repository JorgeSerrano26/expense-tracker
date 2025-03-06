"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface MonthYearPickerProps {
  selectedDate: Date
  onChange: (date: Date) => void
}

export function MonthYearPicker({ selectedDate, onChange }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date)
      setOpen(false)
    }
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("es-AR", {
      month: "long",
      year: "numeric",
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[240px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatMonthYear(selectedDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent mode="single" selected={selectedDate} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

