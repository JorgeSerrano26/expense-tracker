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
import { LoanForm } from "@/components/forms/loan-form"
import { toast } from "sonner"
import { format } from "date-fns"

// Mock data - replace with actual API calls
const mockLoans = [
  {
    id: "1",
    title: "Car Loan",
    description: "Monthly car payment",
    amount: 25000,
    remainingAmount: 18500,
    interestRate: 4.5,
    dueDate: "2027-06-15",
    status: "ACTIVE" as const,
    type: "BORROWED" as const,
  },
  {
    id: "2",
    title: "Loan to Sarah",
    description: "Emergency loan to friend",
    amount: 1500,
    remainingAmount: 800,
    interestRate: 0,
    dueDate: "2024-03-01",
    status: "ACTIVE" as const,
    type: "LENT" as const,
  },
  {
    id: "3",
    title: "Student Loan",
    description: "Education loan payment",
    amount: 45000,
    remainingAmount: 32000,
    interestRate: 6.8,
    dueDate: "2030-12-31",
    status: "ACTIVE" as const,
    type: "BORROWED" as const,
  },
  {
    id: "4",
    title: "Personal Loan - Mike",
    description: "Loan from friend for house deposit",
    amount: 5000,
    remainingAmount: 0,
    interestRate: 0,
    dueDate: "2024-01-15",
    status: "PAID" as const,
    type: "BORROWED" as const,
  },
]

export default function LoansPage() {
  const [loans, setLoans] = useState(mockLoans)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLoan, setEditingLoan] = useState<typeof mockLoans[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleAddLoan = (loanData: any) => {
    const newLoan = {
      id: Date.now().toString(),
      ...loanData,
      createdAt: new Date().toISOString(),
    }
    setLoans([newLoan, ...loans])
    setIsDialogOpen(false)
    toast.success("Loan added successfully!")
  }

  const handleEditLoan = (loanData: any) => {
    setLoans(loans.map(loan => 
      loan.id === editingLoan?.id 
        ? { ...loan, ...loanData }
        : loan
    ))
    setEditingLoan(null)
    setIsDialogOpen(false)
    toast.success("Loan updated successfully!")
  }

  const handleDeleteLoan = (loanId: string) => {
    setLoans(loans.filter(loan => loan.id !== loanId))
    toast.success("Loan deleted successfully!")
  }

  // Filter loans
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || loan.type === typeFilter.toUpperCase()
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter.toUpperCase()
    
    return matchesSearch && matchesType && matchesStatus
  })

  const activeLoans = loans.filter(loan => loan.status === "ACTIVE")
  const borrowedAmount = activeLoans.filter(loan => loan.type === "BORROWED").reduce((sum, loan) => sum + loan.remainingAmount, 0)
  const lentAmount = activeLoans.filter(loan => loan.type === "LENT").reduce((sum, loan) => sum + loan.remainingAmount, 0)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default"
      case "PAID": return "secondary"
      case "OVERDUE": return "destructive"
      default: return "outline"
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    return type === "BORROWED" ? "destructive" : "default"
  }

  const calculateProgress = (amount: number, remaining: number) => {
    return ((amount - remaining) / amount) * 100
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-600">Track money you've borrowed or lent</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingLoan(null)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingLoan ? "Edit Loan" : "Add New Loan"}
              </DialogTitle>
              <DialogDescription>
                {editingLoan 
                  ? "Update your loan information below."
                  : "Add a new loan to track borrowed or lent money."
                }
              </DialogDescription>
            </DialogHeader>
            <LoanForm
              initialData={editingLoan}
              onSubmit={editingLoan ? handleEditLoan : handleAddLoan}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingLoan(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${borrowedAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding debt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Lent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${lentAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Money owed to you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {activeLoans.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Net Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lentAmount - borrowedAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(lentAmount - borrowedAmount).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {lentAmount - borrowedAmount >= 0 ? 'Net creditor' : 'Net debtor'}
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
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
                <SelectItem value="lent">Lent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loans List */}
      <div className="space-y-4">
        {filteredLoans.map((loan) => {
          const progress = calculateProgress(loan.amount, loan.remainingAmount)
          
          return (
            <Card key={loan.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${loan.type === 'BORROWED' ? 'bg-red-100' : 'bg-green-100'}`}>
                      <Icons.handCoins className={`h-6 w-6 ${loan.type === 'BORROWED' ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{loan.title}</h3>
                        <Badge variant={getTypeBadgeVariant(loan.type)}>
                          {loan.type}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(loan.status)}>
                          {loan.status}
                        </Badge>
                      </div>
                      
                      {loan.description && (
                        <p className="text-gray-600 mt-1">{loan.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Interest: {loan.interestRate}%</span>
                        {loan.dueDate && (
                          <>
                            <span>•</span>
                            <span>Due: {format(new Date(loan.dueDate), "MMM dd, yyyy")}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${loan.remainingAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        of ${loan.amount.toLocaleString()}
                      </div>
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
                            setEditingLoan(loan)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Icons.edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteLoan(loan.id)}
                          className="text-red-600"
                        >
                          <Icons.trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Progress Bar */}
                {loan.status === "ACTIVE" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}% paid</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${loan.type === 'BORROWED' ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {filteredLoans.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icons.handCoins className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Get started by adding your first loan."
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Icons.plus className="mr-2 h-4 w-4" />
                Add Loan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
