import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const subscriptions = await prisma.subscription.findMany({
    include: { category: true, card: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(subscriptions);
}
