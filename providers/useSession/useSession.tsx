'use client'

import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

const SessionContext = createContext<{
    user: User | null
}>({
    user: null
})

export const useSession = () => useContext(SessionContext)

type Props = {
    user: User | null
    children: React.ReactNode
}
export const SessionProvider = ({ user, children }: Props) => {
    return <SessionContext.Provider value={{
        user
    }}>
        {children}
    </SessionContext.Provider>
}
