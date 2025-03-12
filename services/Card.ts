import { createClient } from "@/db/supabase/server"

type CardDTO = {
    id: number,
    title: string,
    description: string
}


class Card {
    static async getCards() {
        const client = await createClient()

        const { data, error } = await client.from("cards").select()

        if (error) {
            throw new Error(error.message)
        }

        return data
    }
}