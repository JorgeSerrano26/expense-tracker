"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export type DateSelection =
  | { mode: "month"; month: number; year: number }
  | { mode: "range"; from: string; to: string };

type MonthPickerProps = {
  selection: DateSelection;
  onChange: (selection: DateSelection) => void;
};

function formatRange(from: string, to: string) {
  const fmt = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  });
  return `${fmt.format(new Date(from + "T12:00:00"))} – ${fmt.format(new Date(to + "T12:00:00"))}`;
}

export function MonthPicker({ selection, onChange }: MonthPickerProps) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [rangeError, setRangeError] = useState("");

  function goToPrevious() {
    if (selection.mode !== "month") return;
    const { month, year } = selection;
    if (month === 0) {
      onChange({ mode: "month", month: 11, year: year - 1 });
    } else {
      onChange({ mode: "month", month: month - 1, year });
    }
  }

  function goToNext() {
    if (selection.mode !== "month") return;
    const { month, year } = selection;
    if (month === 11) {
      onChange({ mode: "month", month: 0, year: year + 1 });
    } else {
      onChange({ mode: "month", month: month + 1, year });
    }
  }

  function backToMonth() {
    const now = new Date();
    onChange({ mode: "month", month: now.getMonth(), year: now.getFullYear() });
  }

  function applyRange() {
    if (!fromInput || !toInput) {
      setRangeError("Ambas fechas son obligatorias");
      return;
    }
    const from = new Date(fromInput);
    const to = new Date(toInput);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      setRangeError("Fechas inválidas");
      return;
    }
    if (to < from) {
      setRangeError("La fecha 'Hasta' debe ser posterior a 'Desde'");
      return;
    }
    const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 90) {
      setRangeError("El rango máximo es de 90 días");
      return;
    }
    setRangeError("");
    setRangeOpen(false);
    onChange({ mode: "range", from: fromInput, to: toInput });
  }

  return (
    <div className="flex items-center gap-2">
      {selection.mode === "month" ? (
        <>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[160px] text-center text-sm font-medium">
            {MONTH_NAMES[selection.month]} {selection.year}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="sm" onClick={backToMonth}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Mes
          </Button>
          <span className="min-w-[160px] text-center text-sm font-medium">
            {formatRange(selection.from, selection.to)}
          </span>
        </>
      )}

      <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={selection.mode === "range" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            title="Rango personalizado"
            onClick={() => {
              if (selection.mode === "range") {
                setFromInput(selection.from);
                setToInput(selection.to);
              } else {
                setFromInput("");
                setToInput("");
              }
              setRangeError("");
            }}
          >
            <CalendarRange className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="start">
          <div className="space-y-3">
            <p className="text-sm font-medium">Rango personalizado</p>
            <p className="text-xs text-muted-foreground">Máximo 90 días</p>
            <div className="space-y-2">
              <div>
                <Label htmlFor="range-from" className="text-xs">Desde</Label>
                <Input
                  id="range-from"
                  type="date"
                  value={fromInput}
                  onChange={(e) => setFromInput(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="range-to" className="text-xs">Hasta</Label>
                <Input
                  id="range-to"
                  type="date"
                  value={toInput}
                  onChange={(e) => setToInput(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            {rangeError && (
              <p className="text-xs text-destructive">{rangeError}</p>
            )}
            <Button onClick={applyRange} size="sm" className="w-full">
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
