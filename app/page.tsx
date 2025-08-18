"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (session) {
      router.push("/dashboard")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Expense Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Take control of your finances. Track expenses, manage subscriptions, 
            handle loans, and split costs with friends - all in one place.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/login">
              Get Started
              <Icons.arrowUpRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Icons.receipt className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Track Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your spending with detailed categorization and insights
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Icons.repeat className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Manage Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Keep track of recurring payments and never miss a billing cycle
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Icons.handCoins className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Handle Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track money you've borrowed or lent with interest calculations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Icons.users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Split Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share expenses with friends and track who owes what
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in with your Google account to begin tracking your finances
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">
              <Icons.google className="mr-2 h-5 w-5" />
              Sign in with Google
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
