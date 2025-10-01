import { prisma } from "@/prisma/prisma"
import { CardsPageClient } from "./page.client"
import { getSession } from "@/modules/auth/utils"

export default async function Page() {
  const session = await getSession()
  const cards = await prisma.card.findMany({
    where: {
      user: {
        id: session?.user.id
      }
    }
  })

  return <CardsPageClient initialCards={cards} />
}

