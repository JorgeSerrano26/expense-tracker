"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, CreditCard, DollarSign, PiggyBank, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseList } from "@/components/expense-list"
import { MonthYearPicker } from "@/components/month-year-picker"
import { ExpenseSummary } from "@/components/expense-summary"
import { formatCurrency } from "@/lib/utils"

export function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setSelectedDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setSelectedDate(newDate)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track and manage your expenses, loans, and shared payments.</p>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <MonthYearPicker selectedDate={selectedDate} onChange={setSelectedDate} />
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(12500)}</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(8300)}</div>
            <p className="text-xs text-muted-foreground">3 active cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(4200)}</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(15000)}</div>
            <p className="text-xs text-muted-foreground">2 loans pending</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="cash">Cash</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <ExpenseSummary selectedDate={selectedDate} />
          <ExpenseList selectedDate={selectedDate} filter="all" />
        </TabsContent>
        <TabsContent value="cards" className="space-y-4">
          <ExpenseSummary selectedDate={selectedDate} filter="card" />
          <ExpenseList selectedDate={selectedDate} filter="card" />
        </TabsContent>
        <TabsContent value="cash" className="space-y-4">
          <ExpenseSummary selectedDate={selectedDate} filter="cash" />
          <ExpenseList selectedDate={selectedDate} filter="cash" />
        </TabsContent>
        <TabsContent value="transfers" className="space-y-4">
          <ExpenseSummary selectedDate={selectedDate} filter="transfer" />
          <ExpenseList selectedDate={selectedDate} filter="transfer" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

