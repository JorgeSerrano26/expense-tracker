import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createCard,
  updateCard,
  deleteCard,
  createSubscription,
  updateSubscription,
  toggleSubscription,
  deleteSubscription,
} from "@/app/actions";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateCardInput,
  UpdateCardInput,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  CardType,
  PaymentMethod,
  Currency,
  BillingCycle,
} from "@/lib/validations";

// ── Types ────────────────────────────────────────────────────

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

type Card = {
  id: string;
  bank: string;
  lastFourDigits: string;
  expirationMonth: number;
  expirationYear: number;
  type: CardType;
  createdAt: string;
};

type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingDay: number;
  startDate: string;
  endDate: string | null;
  nextBillingDate: string;
  categoryId: string;
  category: Category;
  paymentMethod: PaymentMethod;
  cardId: string | null;
  card: Card | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type Expense = {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  categoryId: string;
  category: Category;
  paymentMethod: PaymentMethod;
  cardId: string | null;
  card: Card | null;
  subscriptionId: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type { Category, Card, Expense, Subscription };

// ── Categories ───────────────────────────────────────────────

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Error al cargar categorías");
      return res.json();
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// ── Cards ────────────────────────────────────────────────────

export function useCards() {
  return useQuery<Card[]>({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await fetch("/api/cards");
      if (!res.ok) throw new Error("Error al cargar tarjetas");
      return res.json();
    },
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCardInput) => createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardInput }) =>
      updateCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

// ── Expenses ─────────────────────────────────────────────────

export function useExpenses(month: number, year: number) {
  return useQuery<Expense[]>({
    queryKey: ["expenses", month, year],
    queryFn: async () => {
      const res = await fetch(`/api/expenses?month=${month}&year=${year}`);
      if (!res.ok) throw new Error("Error al cargar gastos");
      return res.json();
    },
  });
}

export function useExpensesByRange(from: string, to: string) {
  return useQuery<Expense[]>({
    queryKey: ["expenses", "range", from, to],
    queryFn: async () => {
      const res = await fetch(`/api/expenses?from=${from}&to=${to}`);
      if (!res.ok) throw new Error("Error al cargar gastos");
      return res.json();
    },
    enabled: !!from && !!to,
  });
}

// ── Subscriptions ────────────────────────────────────────────

export function useSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions");
      if (!res.ok) throw new Error("Error al cargar suscripciones");
      return res.json();
    },
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubscriptionInput) => createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionInput }) =>
      updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useToggleSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleSubscription(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
