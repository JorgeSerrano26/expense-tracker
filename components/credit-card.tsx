"use client";

import { cn } from "@/lib/utils";
import { CARD_TYPE_CONFIG } from "@/lib/card-styles";
import type { CardType } from "@/lib/validations";

type CreditCardProps = {
  bank: string;
  lastFourDigits: string;
  expirationMonth: number;
  expirationYear: number;
  type: CardType;
  className?: string;
  compact?: boolean;
};

export function CreditCard({
  bank,
  lastFourDigits,
  expirationMonth,
  expirationYear,
  type,
  className,
  compact = false,
}: CreditCardProps) {
  const config = CARD_TYPE_CONFIG[type];
  const expStr = `${String(expirationMonth).padStart(2, "0")}/${String(expirationYear).slice(-2)}`;

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-md bg-gradient-to-r px-2.5 py-1",
          config.gradient,
          config.text,
          className
        )}
      >
        <span className="text-[10px] font-bold uppercase opacity-80">
          {config.label}
        </span>
        <span className="font-mono text-xs">•••• {lastFourDigits}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[1.586/1] w-full max-w-[320px] overflow-hidden rounded-xl bg-gradient-to-br p-5 shadow-lg",
        config.gradient,
        config.text,
        className
      )}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10" />
      </div>

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-sm font-semibold tracking-wide">{bank}</span>
          <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {config.label}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <div className="h-6 w-9 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80" />
          </div>
          <p className="font-mono text-lg tracking-[0.2em]">
            •••• •••• •••• {lastFourDigits}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase opacity-60">Vencimiento</p>
            <p className="font-mono text-sm">{expStr}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
