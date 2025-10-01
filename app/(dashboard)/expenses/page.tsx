"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExpenseForm } from "@/components/forms/expense-form"
import { toast } from "sonner"

// Mock data - replace with actual API calls
const mockExpenses = [
  {
    id: "1",
    title: "Grocery Shopping",
    description: "Weekly groceries at Walmart",
    amount: 125.50,
    date: "2024-01-28",
    category: "Food",
    isShared: true,
    cardId: "1",
    cardName: "Main Credit Card",
    sharedUsers: [
      { userId: "user1", shareType: "PERCENTAGE", shareValue: 50 },
      { userId: "user2", shareType: "PERCENTAGE", shareValue: 50 },
    ],
  },
  {
    id: "2",
    title: "Gas Station",
    description: "Fill up the tank",
    amount: 65.00,
    date: "2024-01-27",
    category: "Transportation",
    isShared: false,
    cardId: "2",
    cardName: "Debit Card",
  },
  {
    id: "3",
    title: "Restaurant Dinner",
    description: "Dinner with friends",
    amount: 89.99,
    date: "2024-01-26",
    category: "Food",
    isShared: true,
    cardId: "1",
    cardName: "Main Credit Card",
    sharedUsers: [
      { userId: "user1", shareType: "FIXED", shareValue: 30 },
      { userId: "user2", shareType: "FIXED", shareValue: 30 },
      { userId: "user3", shareType: "FIXED", shareValue: 29.99 },
    ],
  },
]

const categories = [
  "All Categories",
  "Food",
  "Transportation", 
  "Entertainment",
  "Shopping",
  "Health",
  "Bills",
  "Other"
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<typeof mockExpenses[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [dateFilter, setDateFilter] = useState("all")

  const handleAddExpense = (expenseData: any) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      cardName: "Main Credit Card", // This would come from the card lookup
      createdAt: new Date().toISOString(),
    }
    setExpenses([newExpense, ...expenses])
    setIsDialogOpen(false)
    toast.success("Expense added successfully!")
  }

  const handleEditExpense = (expenseData: any) => {
    setExpenses(expenses.map(expense => 
      expense.id === editingExpense?.id 
        ? { ...expense, ...expenseData }
        : expense
    ))
    setEditingExpense(null)
    setIsDialogOpen(false)
    toast.success("Expense updated successfully!")
  }

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId))
    toast.success("Expense deleted successfully!")
  }

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || expense.category === selectedCategory
    
    let matchesDate = true
    if (dateFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesDate = new Date(expense.date) >= weekAgo
    } else if (dateFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchesDate = new Date(expense.date) >= monthAgo
    }
    
    return matchesSearch && matchesCategory && matchesDate
  })

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const sharedExpenses = filteredExpenses.filter(expense => expense.isShared)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage your expenses</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExpense(null)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </DialogTitle>
              <DialogDescription>
                {editingExpense 
                  ? "Update your expense information below."
                  : "Add a new expense to track your spending."
                }
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm
              initialData={editingExpense}
              onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingExpense(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredExpenses.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Shared Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sharedExpenses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              ${sharedExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${expenses.filter(exp => {
                const expDate = new Date(exp.date)
                const now = new Date()
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
              }).reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-red-100">
                    <Icons.receipt className="h-6 w-6 text-red-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{expense.title}</h3>
                      {expense.isShared && (
                        <Badge variant="secondary">
                          <Icons.users className="mr-1 h-3 w-3" />
                          Shared
                        </Badge>
                      )}
                    </div>
                    
                    {expense.description && (
                      <p className="text-gray-600 mt-1">{expense.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString("en-US")}</span>
                      <span>•</span>
                      <span>{expense.cardName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      ${expense.amount.toFixed(2)}
                    </div>
                    {expense.isShared && expense.sharedUsers && (
                      <div className="text-sm text-gray-500">
                        Split {expense.sharedUsers.length + 1} ways
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Icons.settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingExpense(expense)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Icons.edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600"
                      >
                        <Icons.trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExpenses.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icons.receipt className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm || selectedCategory !== "All Categories" 
                  ? "Try adjusting your filters to see more results."
                  : "Get started by adding your first expense."
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Icons.plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
