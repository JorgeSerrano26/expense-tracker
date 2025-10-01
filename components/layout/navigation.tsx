"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

const navigation = [
  { name: "Dashboard", href: "/", icon: Icons.home },
  { name: "Cards", href: "/cards", icon: Icons.card },
  { name: "Expenses", href: "/expenses", icon: Icons.receipt },
  { name: "Subscriptions", href: "/subscriptions", icon: Icons.repeat },
  { name: "Loans", href: "/loans", icon: Icons.handCoins },
  { name: "Transfers", href: "/transfers", icon: Icons.arrowUpRight },
]

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <nav className=" px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          ExpenseTracker
        </Link>

        <div className="hidden md:flex space-x-1 bg-white/10 px-4 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5.6px] border border-white/30">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-white before:bg-white"
                    : "text-gray-600 hover:text-white",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
              <Icons.logout className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
