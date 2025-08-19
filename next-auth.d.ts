import 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
        } & import('next-auth').DefaultSession['user'];
    }

    interface User {
        id: string;

    }

}

declare module 'next-auth/jwt' {
    interface JWT extends NextAuthJWT {
        id: string;

    }
}