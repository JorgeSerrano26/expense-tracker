import { prisma } from "@/prisma/prisma";
import { User } from "@prisma/client";
import { Account, Profile } from "next-auth";

export class AuthService {
    static async findOrCreate(account: Account, profile: Profile): Promise<User> {
        const { email } = profile;
        const { provider, providerAccountId } = account;
        
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            return user;
        }

        
        const newUser = await prisma.user.create({
            data: {
                provider,
                providerId: providerAccountId,
                email: email!,
            },
        });

        return newUser;
        
    }
}
