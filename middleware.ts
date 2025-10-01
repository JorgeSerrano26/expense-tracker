// GEnerate a middleware to blocke the access to /dashboard* routes

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/login") && token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// Match with all routes
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
