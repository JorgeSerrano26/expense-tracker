"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createExpenseSchema,
  updateExpenseSchema,
  createCategorySchema,
  updateCategorySchema,
  createCardSchema,
  updateCardSchema,
  createSubscriptionSchema,
  updateSubscriptionSchema,
  SUBSCRIPTION_CATEGORY_NAME,
  type CreateExpenseInput,
  type UpdateExpenseInput,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type CreateCardInput,
  type UpdateCardInput,
  type CreateSubscriptionInput,
  type UpdateSubscriptionInput,
  type BillingCycle,
} from "@/lib/validations";

// ── Categories ──────────────────────────────────────────────

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: CreateCategoryInput) {
  const parsed = createCategorySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  return prisma.category.create({
    data: { name: parsed.data.name },
  });
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const parsed = updateCategorySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  return prisma.category.update({
    where: { id },
    data: { name: parsed.data.name },
  });
}

export async function deleteCategory(id: string) {
  const expenseCount = await prisma.expense.count({
    where: { categoryId: id },
  });
  if (expenseCount > 0) {
    throw new Error(
      `No se puede eliminar: hay ${expenseCount} gasto(s) con esta categoría`
    );
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
}

// ── Cards ───────────────────────────────────────────────────

export async function getCards() {
  return prisma.card.findMany({
    orderBy: { bank: "asc" },
  });
}

export async function createCard(data: CreateCardInput) {
  const parsed = createCardSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  return prisma.card.create({ data: parsed.data });
}

export async function updateCard(id: string, data: UpdateCardInput) {
  const parsed = updateCardSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  return prisma.card.update({ where: { id }, data: parsed.data });
}

export async function deleteCard(id: string) {
  const expenseCount = await prisma.expense.count({
    where: { cardId: id },
  });
  if (expenseCount > 0) {
    throw new Error(
      `No se puede eliminar: hay ${expenseCount} gasto(s) con esta tarjeta`
    );
  }
  await prisma.card.delete({ where: { id } });
  revalidatePath("/tarjetas");
}

// ── Expenses ────────────────────────────────────────────────

export async function getExpenses(month: number, year: number) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  return prisma.expense.findMany({
    where: {
      date: { gte: startDate, lt: endDate },
    },
    include: { category: true, card: true },
    orderBy: { date: "desc" },
  });
}

export async function createExpense(data: CreateExpenseInput) {
  const parsed = createExpenseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const installments = parsed.data.installments ?? 1;
  const baseDate = new Date(parsed.data.date);
  const [year, month, day] = parsed.data.date.split("-").map(Number);

  const note = parsed.data.note || null;

  if (installments <= 1) {
    await prisma.expense.create({
      data: {
        description: parsed.data.description,
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        categoryId: parsed.data.categoryId,
        date: baseDate,
        paymentMethod: parsed.data.paymentMethod,
        cardId: parsed.data.cardId ?? null,
        note,
      },
    });
  } else {
    const amountPerInstallment = Math.round((parsed.data.amount / installments) * 100) / 100;
    const expenses = Array.from({ length: installments }, (_, i) => {
      const m = month - 1 + i;
      const targetYear = year + Math.floor(m / 12);
      const targetMonth = ((m % 12) + 12) % 12;
      const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
      const clampedDay = Math.min(day, lastDay);

      return {
        description: `${parsed.data.description} ${i + 1}/${installments}`,
        amount: amountPerInstallment,
        currency: parsed.data.currency,
        categoryId: parsed.data.categoryId,
        date: new Date(targetYear, targetMonth, clampedDay),
        paymentMethod: parsed.data.paymentMethod,
        cardId: parsed.data.cardId ?? null,
        note,
      };
    });

    await prisma.expense.createMany({ data: expenses });
  }

  revalidatePath("/");
}

export async function updateExpense(id: string, data: UpdateExpenseInput) {
  const parsed = updateExpenseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  await prisma.expense.update({
    where: { id },
    data: {
      description: parsed.data.description,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      categoryId: parsed.data.categoryId,
      date: new Date(parsed.data.date),
      paymentMethod: parsed.data.paymentMethod,
      cardId: parsed.data.cardId ?? null,
      note: parsed.data.note || null,
    },
  });
  revalidatePath("/");
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/");
}

// ── Subscriptions ──────────────────────────────────────────

async function getOrCreateSubscriptionCategory(): Promise<string> {
  const cat = await prisma.category.upsert({
    where: { name: SUBSCRIPTION_CATEGORY_NAME },
    update: {},
    create: { name: SUBSCRIPTION_CATEGORY_NAME },
  });
  return cat.id;
}

function clampDay(year: number, month: number, day: number) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return Math.min(day, lastDay);
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function computeFirstBillingDate(startDate: Date, billingDay: number): Date {
  const y = startDate.getFullYear();
  const m = startDate.getMonth();
  return new Date(y, m, clampDay(y, m, billingDay));
}

function advanceBillingDate(current: Date, cycle: BillingCycle, billingDay: number): Date {
  let y = current.getFullYear();
  let m = current.getMonth();
  if (cycle === "MONTHLY") {
    m += 1;
  } else {
    y += 1;
  }
  return new Date(y, m, clampDay(y, m, billingDay));
}

export async function getSubscriptions() {
  return prisma.subscription.findMany({
    include: { category: true, card: true },
    orderBy: { name: "asc" },
  });
}

export async function createSubscription(data: CreateSubscriptionInput) {
  const parsed = createSubscriptionSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const categoryId = await getOrCreateSubscriptionCategory();
  const startDate = parseLocalDate(parsed.data.startDate);
  const endDate = parsed.data.endDate ? parseLocalDate(parsed.data.endDate) : null;
  let nextBillingDate = computeFirstBillingDate(startDate, parsed.data.billingDay);

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const endLimit = endDate ?? today;

  const expensesToCreate: {
    description: string;
    amount: number;
    currency: typeof parsed.data.currency;
    categoryId: string;
    date: Date;
    paymentMethod: typeof parsed.data.paymentMethod;
    cardId: string | null;
  }[] = [];

  while (nextBillingDate <= today && nextBillingDate <= endLimit) {
    expensesToCreate.push({
      description: parsed.data.name,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      categoryId,
      date: new Date(nextBillingDate),
      paymentMethod: parsed.data.paymentMethod,
      cardId: parsed.data.cardId ?? null,
    });
    nextBillingDate = advanceBillingDate(nextBillingDate, parsed.data.billingCycle, parsed.data.billingDay);
  }

  const sub = await prisma.subscription.create({
    data: {
      name: parsed.data.name,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      billingCycle: parsed.data.billingCycle,
      billingDay: parsed.data.billingDay,
      startDate,
      endDate,
      nextBillingDate,
      categoryId,
      paymentMethod: parsed.data.paymentMethod,
      cardId: parsed.data.cardId ?? null,
    },
  });

  if (expensesToCreate.length > 0) {
    await prisma.expense.createMany({
      data: expensesToCreate.map((e) => ({
        ...e,
        subscriptionId: sub.id,
      })),
    });
  }

  revalidatePath("/");
}

export async function updateSubscription(id: string, data: UpdateSubscriptionInput) {
  const parsed = updateSubscriptionSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const existing = await prisma.subscription.findUniqueOrThrow({ where: { id } });

  const startDate = parseLocalDate(parsed.data.startDate);
  const endDate = parsed.data.endDate ? parseLocalDate(parsed.data.endDate) : null;
  const billingDayChanged = parsed.data.billingDay !== existing.billingDay;
  const startChanged = startDate.getTime() !== existing.startDate.getTime();

  let nextBillingDate = existing.nextBillingDate;
  if (billingDayChanged || startChanged) {
    const candidate = computeFirstBillingDate(new Date(), parsed.data.billingDay);
    if (candidate > existing.nextBillingDate || billingDayChanged) {
      nextBillingDate = candidate;
    }
  }

  await prisma.subscription.update({
    where: { id },
    data: {
      name: parsed.data.name,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      billingCycle: parsed.data.billingCycle,
      billingDay: parsed.data.billingDay,
      startDate,
      endDate,
      nextBillingDate,
      paymentMethod: parsed.data.paymentMethod,
      cardId: parsed.data.cardId ?? null,
    },
  });
  revalidatePath("/");
}

export async function toggleSubscription(id: string, active: boolean) {
  const sub = await prisma.subscription.findUniqueOrThrow({ where: { id } });

  const data: { active: boolean; nextBillingDate?: Date } = { active };
  if (active && !sub.active) {
    data.nextBillingDate = computeFirstBillingDate(new Date(), sub.billingDay);
  }

  await prisma.subscription.update({ where: { id }, data });
  revalidatePath("/");
}

export async function deleteSubscription(id: string) {
  await prisma.expense.updateMany({
    where: { subscriptionId: id },
    data: { subscriptionId: null },
  });
  await prisma.subscription.delete({ where: { id } });
  revalidatePath("/");
}

export async function generateSubscriptionExpenses() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const subs = await prisma.subscription.findMany({
    where: {
      active: true,
      nextBillingDate: { lte: today },
    },
  });

  for (const sub of subs) {
    if (sub.endDate && sub.endDate < sub.nextBillingDate) continue;

    let next = new Date(sub.nextBillingDate);
    const endLimit = sub.endDate ?? today;

    while (next <= today && next <= endLimit) {
      await prisma.expense.create({
        data: {
          description: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          categoryId: sub.categoryId,
          date: next,
          paymentMethod: sub.paymentMethod,
          cardId: sub.cardId,
          subscriptionId: sub.id,
        },
      });
      next = advanceBillingDate(next, sub.billingCycle, sub.billingDay);
    }

    await prisma.subscription.update({
      where: { id: sub.id },
      data: { nextBillingDate: next },
    });
  }
}
