import { CardFormData } from "@/lib/types"
import { getSession } from "@/modules/auth/utils"
import { prisma } from "@/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const session = await getSession()

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as CardFormData
    
    try {
        const card = await prisma.card.create({
            data: {
                description: body.description,
                lastDigits: body.lastDigits,
                type: body.type,
                bank: body.bank,
                user: {
                    connect: {
                        id: session.user.id
                    }
                }
            }  
        })
        return NextResponse.json(card)
    } catch (error) {
        return NextResponse.json({ message: "Failed to add card" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const cards = await prisma.card.findMany()
        return NextResponse.json(cards)
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch cards" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getSession()

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as { id: number }
    
    try {
        const card = await prisma.card.delete({
            where: {
                id: body.id
            }
        })
        return NextResponse.json(card)
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete card" }, { status: 500 })
    }
}

