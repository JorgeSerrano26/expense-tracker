"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { useSession } from "@/providers/useSession/useSession"
import { CreditCard, Home, PlusCircle, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const user = useSession()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/expenses/new",
      label: "Add Expense",
      icon: PlusCircle,
      active: pathname === "/expenses/new",
    },
    {
      href: "/cards",
      label: "Cards",
      icon: CreditCard,
      active: pathname === "/cards" || pathname === "/cards/new",
    },
    {
      href: "/loans",
      label: "Loans",
      icon: Wallet,
      active: pathname === "/loans" || pathname === "/loans/new",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Expense Tracker</span>
          </Link>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center md:hidden">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md px-0 text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-5 w-5" />
                <span className="sr-only">{route.label}</span>
              </Link>
            ))}
          </nav>
          <ModeToggle />
        </div>
        {user && <div className="ml-2">
          <p>{user?.user?.email}</p>
        </div>}
      </div>
    </header>
  )
}

