import type { CardType, PaymentMethod } from "@/lib/validations";

export const CARD_TYPE_CONFIG: Record<
  CardType,
  { label: string; gradient: string; text: string }
> = {
  VISA: {
    label: "Visa",
    gradient: "from-blue-600 to-blue-900",
    text: "text-white",
  },
  MASTERCARD: {
    label: "Mastercard",
    gradient: "from-red-500 to-orange-600",
    text: "text-white",
  },
  AMEX: {
    label: "American Express",
    gradient: "from-emerald-500 to-teal-700",
    text: "text-white",
  },
  CABAL: {
    label: "Cabal",
    gradient: "from-indigo-500 to-purple-700",
    text: "text-white",
  },
  NARANJA: {
    label: "Naranja",
    gradient: "from-orange-400 to-orange-600",
    text: "text-white",
  },
  MAESTRO: {
    label: "Maestro",
    gradient: "from-sky-400 to-cyan-600",
    text: "text-white",
  },
  DINERS: {
    label: "Diners Club",
    gradient: "from-slate-400 to-slate-600",
    text: "text-white",
  },
  OTHER: {
    label: "Otra",
    gradient: "from-zinc-400 to-zinc-600",
    text: "text-white",
  },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
};
