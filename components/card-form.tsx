"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreditCard } from "@/components/credit-card";
import { createCard, updateCard } from "@/app/actions";
import { createCardSchema, CARD_TYPES } from "@/lib/validations";
import { CARD_TYPE_CONFIG } from "@/lib/card-styles";
import type { CardType } from "@/lib/validations";

type CardData = {
  id: string;
  bank: string;
  lastFourDigits: string;
  expirationMonth: number;
  expirationYear: number;
  type: CardType;
};

type CardFormProps = {
  card?: CardData | null;
  onSuccess: () => void;
};

export function CardForm({ card, onSuccess }: CardFormProps) {
  const [isPending, startTransition] = useTransition();
  const [cardType, setCardType] = useState<CardType>(card?.type ?? "VISA");
  const [bank, setBank] = useState(card?.bank ?? "");
  const [digits, setDigits] = useState(card?.lastFourDigits ?? "");
  const [expMonth, setExpMonth] = useState(
    card ? String(card.expirationMonth) : ""
  );
  const [expYear, setExpYear] = useState(
    card ? String(card.expirationYear) : ""
  );

  const isEditing = !!card;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const raw = {
      bank: bank.trim(),
      lastFourDigits: digits,
      expirationMonth: parseInt(expMonth),
      expirationYear: parseInt(expYear),
      type: cardType,
    };

    const parsed = createCardSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateCard(card.id, parsed.data);
          toast.success("Tarjeta actualizada");
        } else {
          await createCard(parsed.data);
          toast.success("Tarjeta agregada");
        }
        onSuccess();
      } catch {
        toast.error("Error al guardar la tarjeta");
      }
    });
  }

  const previewValid = bank.trim() && digits.length === 4;

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar tarjeta" : "Agregar tarjeta"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Modificá los datos de la tarjeta."
            : "Completá los datos de tu tarjeta."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {previewValid && (
          <div className="flex justify-center">
            <CreditCard
              bank={bank.trim()}
              lastFourDigits={digits}
              expirationMonth={parseInt(expMonth) || 1}
              expirationYear={parseInt(expYear) || 2025}
              type={cardType}
              className="w-full max-w-[280px]"
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label>Tipo de tarjeta</Label>
          <Select
            value={cardType}
            onValueChange={(v) => setCardType(v as CardType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CARD_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {CARD_TYPE_CONFIG[t].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Banco</Label>
          <Input
            placeholder="Ej: Galicia, BBVA, Santander"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Últimos 4 dígitos</Label>
          <Input
            placeholder="1234"
            maxLength={4}
            value={digits}
            onChange={(e) => setDigits(e.target.value.replace(/\D/g, ""))}
            className="font-mono"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Mes vto.</Label>
            <Select value={expMonth} onValueChange={setExpMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {String(m).padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Año vto.</Label>
            <Select value={expYear} onValueChange={setExpYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => 2024 + i).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Agregar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
