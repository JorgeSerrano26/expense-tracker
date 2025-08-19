/**
 * Dependencies
 */
import { NextAuthOptions } from "next-auth";

/**
 * Providers
 */
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/modules/auth/AuthService";

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider === "google") {
                const { id } = await AuthService.findOrCreate(account, profile!)

                user.id = id
            }

            return true
        },
        async jwt({ token, user, account }) {
            if (account) {
                token.id = user?.id
            }

            return token
        },
        async session({ session, token }) {
            session.user.id = token.id as string;

            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
}