import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { expensesQuerySchema, expensesRangeQuerySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let startDate: Date;
  let endDate: Date;

  if (from && to) {
    const parsed = expensesRangeQuerySchema.safeParse({ from, to });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    startDate = new Date(parsed.data.from + "T00:00:00");
    endDate = new Date(parsed.data.to + "T23:59:59.999");
  } else {
    const parsed = expensesQuerySchema.safeParse({
      month: searchParams.get("month"),
      year: searchParams.get("year"),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const { month, year } = parsed.data;
    startDate = new Date(year, month, 1);
    endDate = new Date(year, month + 1, 1);
  }

  const expenses = await prisma.expense.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    include: { category: true, card: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(expenses);
}
