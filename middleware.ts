// GEnerate a middleware to blocke the access to /dashboard* routes

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/login")) {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/dashboard/:path*",
        "/cards/:path*",
        "/loans/:path*",
        "/transfers/:path*",
        "/expenses/:path*",
        "/subscriptions/:path*",
        "/friends/:path*",
        "/settings",
    ],
};
