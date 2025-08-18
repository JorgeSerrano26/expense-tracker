"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data - replace with actual API calls
const mockStats = {
  monthlyTotal: 2450.75,
  monthlyIncome: 5000.00,
  monthlyExpenses: 1850.25,
  monthlySubscriptions: 89.99,
  activeLoans: 3,
  pendingTransfers: 2,
}

const mockRecentMovements = [
  {
    id: "1",
    type: "expense",
    title: "Grocery Shopping",
    amount: -125.50,
    date: "2024-01-28",
    category: "Food",
    isShared: true,
  },
  {
    id: "2", 
    type: "transfer",
    title: "Split dinner bill",
    amount: -45.00,
    date: "2024-01-27",
    category: "Transfer",
    recipientEmail: "friend@example.com",
  },
  {
    id: "3",
    type: "subscription",
    title: "Netflix",
    amount: -15.99,
    date: "2024-01-26",
    category: "Entertainment",
  },
  {
    id: "4",
    type: "loan",
    title: "Loan payment to John",
    amount: -200.00,
    date: "2024-01-25",
    category: "Loan",
  },
  {
    id: "5",
    type: "expense",
    title: "Gas Station",
    amount: -65.00,
    date: "2024-01-24",
    category: "Transportation",
  },
]

export default function DashboardPage() {
  const { data: session } = useSession()

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "expense":
        return Icons.receipt
      case "transfer":
        return Icons.arrowUpRight
      case "subscription":
        return Icons.repeat
      case "loan":
        return Icons.handCoins
      default:
        return Icons.dollar
    }
  }

  const getMovementColor = (type: string) => {
    switch (type) {
      case "expense":
        return "text-red-600"
      case "transfer":
        return "text-blue-600"
      case "subscription":
        return "text-purple-600"
      case "loan":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <Icons.dollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${mockStats.monthlyTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Income - Expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <Icons.trendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${mockStats.monthlyExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Icons.repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${mockStats.monthlySubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Icons.handCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockStats.activeLoans}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockStats.pendingTransfers} pending transfers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Movements</CardTitle>
            <CardDescription>
              Your last 10 transactions across all categories
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/expenses">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentMovements.map((movement) => {
              const IconComponent = getMovementIcon(movement.type)
              const colorClass = getMovementColor(movement.type)
              
              return (
                <div key={movement.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100 ${colorClass}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{movement.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{movement.category}</span>
                        <span>•</span>
                        <span>{new Date(movement.date).toLocaleDateString()}</span>
                        {movement.isShared && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">Shared</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ${movement.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {movement.amount < 0 ? '-' : '+'}${Math.abs(movement.amount).toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your finances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/expenses/new">
                <Icons.plus className="h-6 w-6 mb-2" />
                Add Expense
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/cards/new">
                <Icons.card className="h-6 w-6 mb-2" />
                Add Card
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/transfers/new">
                <Icons.arrowUpRight className="h-6 w-6 mb-2" />
                New Transfer
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/subscriptions/new">
                <Icons.repeat className="h-6 w-6 mb-2" />
                Add Subscription
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
