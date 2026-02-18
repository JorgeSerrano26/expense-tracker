import { z } from "zod";

// ── Enums ────────────────────────────────────────────────────

export const CARD_TYPES = [
  "VISA",
  "MASTERCARD",
  "AMEX",
  "CABAL",
  "NARANJA",
  "MAESTRO",
  "DINERS",
  "OTHER",
] as const;

export const PAYMENT_METHODS = ["CASH", "CARD", "TRANSFER"] as const;

export const CURRENCIES = ["ARS", "USD", "EUR", "BRL"] as const;

export const CURRENCY_LABELS: Record<(typeof CURRENCIES)[number], string> = {
  ARS: "ARS $",
  USD: "USD US$",
  EUR: "EUR €",
  BRL: "BRL R$",
};

export const CURRENCY_SYMBOLS: Record<(typeof CURRENCIES)[number], string> = {
  ARS: "$",
  USD: "US$",
  EUR: "€",
  BRL: "R$",
};

export const BILLING_CYCLES = ["MONTHLY", "YEARLY"] as const;

export const BILLING_CYCLE_LABELS: Record<(typeof BILLING_CYCLES)[number], string> = {
  MONTHLY: "/mes",
  YEARLY: "/año",
};

export const cardTypeSchema = z.enum(CARD_TYPES);
export const paymentMethodSchema = z.enum(PAYMENT_METHODS);
export const currencySchema = z.enum(CURRENCIES);
export const billingCycleSchema = z.enum(BILLING_CYCLES);

// ── Categories ───────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
});

// ── Cards ────────────────────────────────────────────────────

export const createCardSchema = z.object({
  bank: z
    .string()
    .min(1, "El banco es obligatorio")
    .max(50, "El banco no puede tener más de 50 caracteres"),
  lastFourDigits: z
    .string()
    .regex(/^\d{4}$/, "Deben ser exactamente 4 dígitos"),
  expirationMonth: z.number().int().min(1).max(12),
  expirationYear: z.number().int().min(2020).max(2050),
  type: cardTypeSchema,
});

export const updateCardSchema = createCardSchema;

// ── Expenses ─────────────────────────────────────────────────

export const createExpenseSchema = z
  .object({
    description: z
      .string()
      .min(1, "La descripción es obligatoria")
      .max(200, "La descripción no puede tener más de 200 caracteres"),
    amount: z
      .number()
      .positive("El monto debe ser mayor a 0")
      .finite("El monto debe ser un número válido"),
    currency: currencySchema.default("ARS"),
    categoryId: z.string().min(1, "La categoría es obligatoria"),
    date: z.string().min(1, "La fecha es obligatoria"),
    paymentMethod: paymentMethodSchema,
    cardId: z.string().nullable().optional(),
    note: z
      .string()
      .max(500, "El comentario no puede tener más de 500 caracteres")
      .nullable()
      .optional(),
    installments: z
      .number()
      .int("Las cuotas deben ser un número entero")
      .min(1, "Mínimo 1 cuota")
      .max(48, "Máximo 48 cuotas")
      .optional()
      .default(1),
  })
  .refine(
    (data) => data.paymentMethod !== "CARD" || !!data.cardId,
    { message: "Seleccioná una tarjeta", path: ["cardId"] }
  );

export const updateExpenseSchema = createExpenseSchema;

export const expensesQuerySchema = z.object({
  month: z.coerce.number().int().min(0).max(11),
  year: z.coerce.number().int().min(2000).max(2100),
});

export const expensesRangeQuerySchema = z
  .object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  })
  .refine(
    (data) => {
      const from = new Date(data.from);
      const to = new Date(data.to);
      const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 90;
    },
    { message: "El rango máximo es de 90 días" }
  );

// ── Subscriptions ────────────────────────────────────────────

export const SUBSCRIPTION_CATEGORY_NAME = "Suscripciones";

export const createSubscriptionSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(100, "El nombre no puede tener más de 100 caracteres"),
    amount: z
      .number()
      .positive("El monto debe ser mayor a 0")
      .finite("El monto debe ser un número válido"),
    currency: currencySchema.default("ARS"),
    billingCycle: billingCycleSchema.default("MONTHLY"),
    billingDay: z.number().int().min(1, "Mínimo día 1").max(31, "Máximo día 31").default(1),
    startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
    endDate: z.string().nullable().optional(),
    paymentMethod: paymentMethodSchema,
    cardId: z.string().nullable().optional(),
  })
  .refine(
    (data) => data.paymentMethod !== "CARD" || !!data.cardId,
    { message: "Seleccioná una tarjeta", path: ["cardId"] }
  );

export const updateSubscriptionSchema = createSubscriptionSchema;

// ── Types ────────────────────────────────────────────────────

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type ExpensesQueryInput = z.infer<typeof expensesQuerySchema>;
export type CardType = (typeof CARD_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type Currency = (typeof CURRENCIES)[number];
export type BillingCycle = (typeof BILLING_CYCLES)[number];
