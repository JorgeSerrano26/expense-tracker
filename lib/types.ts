import { z } from "zod"

// Enums
export const CardType = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT", 
  CASH: "CASH"
} as const

export const ShareType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED"
} as const

export const SharedExpenseStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED"
} as const

export const SubscriptionFrequency = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  YEARLY: "YEARLY"
} as const

export const LoanStatus = {
  ACTIVE: "ACTIVE",
  PAID: "PAID",
  OVERDUE: "OVERDUE"
} as const

export const LoanType = {
  BORROWED: "BORROWED",
  LENT: "LENT"
} as const

export const TransferType = {
  SENT: "SENT",
  RECEIVED: "RECEIVED"
} as const

export const TransferStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
} as const

// Form Schemas
export const cardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastFour: z.string().length(4, "Last four digits required"),
  type: z.enum(["CREDIT", "DEBIT", "CASH"]),
  color: z.string().default("#3B82F6"),
  bank: z.string()
})

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.date(),
  category: z.string().min(1, "Category is required"),
  isShared: z.boolean().default(false),
  cardId: z.string().optional(),
  sharedUsers: z.array(z.object({
    userId: z.string(),
    shareType: z.enum(["PERCENTAGE", "FIXED"]),
    shareValue: z.number().min(0),
  })).optional(),
})

export const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  frequency: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  nextPayment: z.date(),
  isActive: z.boolean().default(true),
  category: z.string().min(1, "Category is required"),
})

export const loanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  remainingAmount: z.number().min(0),
  interestRate: z.number().min(0).default(0),
  dueDate: z.date().optional(),
  status: z.enum(["ACTIVE", "PAID", "OVERDUE"]).default("ACTIVE"),
  type: z.enum(["BORROWED", "LENT"]),
})

export const transferSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["SENT", "RECEIVED"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]).default("COMPLETED"),
  recipientEmail: z.string().email().optional(),
})

// Type exports
export type CardFormData = z.infer<typeof cardSchema>
export type ExpenseFormData = z.infer<typeof expenseSchema>
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>
export type LoanFormData = z.infer<typeof loanSchema>
export type TransferFormData = z.infer<typeof transferSchema>
