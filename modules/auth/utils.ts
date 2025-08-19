import { getServerSession } from "next-auth/next";
import { options } from "./options";

export function getSession() {
    return getServerSession(options)
}