import { createClient } from "@/db/supabase/server"

export type CardBrand = {
    id: number
    name: string
    value: string
}

export class Card {
    static async getCards() {
        const client = await createClient()

        const { data: { user } } = await client.auth.getUser()

        const { data, error } = await client
            .from("cards")
            .select()
            .eq("user_id", user?.id)

        if (error) {
            throw new Error(error.message)
        }

        return data
    }

    static async createCard() {
        const client = await createClient()

        const { data, error } = await client.from("cards").insert({}).select()

        if (error) {
            throw new Error(error.message)
        }

        return data
    }

    static async getBrands() {
        const client = await createClient()

        const { data, error } = await client
            .from("card_brands")
            .select<"*", CardBrand>()

        if (error) {
            throw new Error(error.message)
        }

        return data;
    }

}