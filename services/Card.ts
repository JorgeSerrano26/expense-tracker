import { createClient } from "@/db/supabase/server"

export type CardBrand = {
    id: number
    name: string
    value: string
}

export type CardType = {
    id: number
    user_id: string
    brand_id: number
    name: string
    card_type: 'credit' | 'debit'
    expire_date: string
    currency_id: number
    created_at: string
    last_digits: string
    color: string
    card_brands: { name: string }
    currencies: { code: string }
}

export class Card {
    static async getCards() {
        const client = await createClient()

        const { data: { user } } = await client.auth.getUser()

        const { data, error } = await client
            .from("cards")
            .select<'*, card_brands(name), currencies(code)', CardType>('*, card_brands(name), currencies(code)')
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