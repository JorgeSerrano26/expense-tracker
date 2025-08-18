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
import { TransferForm } from "@/components/forms/transfer-form"
import { toast } from "sonner"
import { format } from "date-fns"

// Mock data - replace with actual API calls
const mockTransfers = [
  {
    id: "1",
    title: "Split dinner bill",
    description: "Dinner at Italian restaurant",
    amount: 45.00,
    type: "SENT" as const,
    status: "COMPLETED" as const,
    recipientEmail: "sarah@example.com",
    createdAt: "2024-01-28",
  },
  {
    id: "2",
    title: "Rent split payment",
    description: "Monthly rent contribution",
    amount: 800.00,
    type: "RECEIVED" as const,
    status: "COMPLETED" as const,
    recipientEmail: "roommate@example.com",
    createdAt: "2024-01-25",
  },
  {
    id: "3",
    title: "Concert tickets",
    description: "Shared concert tickets cost",
    amount: 120.00,
    type: "SENT" as const,
    status: "PENDING" as const,
    recipientEmail: "friend@example.com",
    createdAt: "2024-01-24",
  },
  {
    id: "4",
    title: "Grocery reimbursement",
    description: "Shared grocery shopping",
    amount: 67.50,
    type: "RECEIVED" as const,
    status: "COMPLETED" as const,
    recipientEmail: "partner@example.com",
    createdAt: "2024-01-22",
  },
  {
    id: "5",
    title: "Gas money",
    description: "Road trip gas split",
    amount: 35.00,
    type: "SENT" as const,
    status: "FAILED" as const,
    recipientEmail: "travel@example.com",
    createdAt: "2024-01-20",
  },
]

export default function TransfersPage() {
  const [transfers, setTransfers] = useState(mockTransfers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransfer, setEditingTransfer] = useState<typeof mockTransfers[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleAddTransfer = (transferData: any) => {
    const newTransfer = {
      id: Date.now().toString(),
      ...transferData,
      createdAt: new Date().toISOString(),
    }
    setTransfers([newTransfer, ...transfers])
    setIsDialogOpen(false)
    toast.success("Transfer added successfully!")
  }

  const handleEditTransfer = (transferData: any) => {
    setTransfers(transfers.map(transfer => 
      transfer.id === editingTransfer?.id 
        ? { ...transfer, ...transferData }
        : transfer
    ))
    setEditingTransfer(null)
    setIsDialogOpen(false)
    toast.success("Transfer updated successfully!")
  }

  const handleDeleteTransfer = (transferId: string) => {
    setTransfers(transfers.filter(transfer => transfer.id !== transferId))
    toast.success("Transfer deleted successfully!")
  }

  // Filter transfers
  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.recipientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transfer.type === typeFilter.toUpperCase()
    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter.toUpperCase()
    
    return matchesSearch && matchesType && matchesStatus
  })

  const sentAmount = transfers.filter(t => t.type === "SENT" && t.status === "COMPLETED").reduce((sum, t) => sum + t.amount, 0)
  const receivedAmount = transfers.filter(t => t.type === "RECEIVED" && t.status === "COMPLETED").reduce((sum, t) => sum + t.amount, 0)
  const pendingTransfers = transfers.filter(t => t.status === "PENDING")

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED": return "default"
      case "PENDING": return "secondary"
      case "FAILED": return "destructive"
      default: return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "SENT" ? Icons.arrowUpRight : Icons.arrowDownLeft
  }

  const getTypeColor = (type: string) => {
    return type === "SENT" ? "text-red-600" : "text-green-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
          <p className="text-gray-600">Track money sent and received with friends</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTransfer(null)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransfer ? "Edit Transfer" : "Add New Transfer"}
              </DialogTitle>
              <DialogDescription>
                {editingTransfer 
                  ? "Update your transfer information below."
                  : "Record a new money transfer with friends."
                }
              </DialogDescription>
            </DialogHeader>
            <TransferForm
              initialData={editingTransfer}
              onSubmit={editingTransfer ? handleEditTransfer : handleAddTransfer}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingTransfer(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${sentAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Money sent to others
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${receivedAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Money received from others
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingTransfers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              ${pendingTransfers.reduce((sum, t) => sum + t.amount, 0).toFixed(2)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${receivedAmount - sentAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(receivedAmount - sentAmount).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {receivedAmount - sentAmount >= 0 ? 'Net positive' : 'Net negative'}
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
                placeholder="Search transfers..."
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
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transfers List */}
      <div className="space-y-4">
        {filteredTransfers.map((transfer) => {
          const IconComponent = getTypeIcon(transfer.type)
          const typeColor = getTypeColor(transfer.type)
          
          return (
            <Card key={transfer.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${transfer.type === 'SENT' ? 'bg-red-100' : 'bg-green-100'}`}>
                      <IconComponent className={`h-6 w-6 ${typeColor}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{transfer.title}</h3>
                        <Badge variant={getStatusBadgeVariant(transfer.status)}>
                          {transfer.status}
                        </Badge>
                      </div>
                      
                      {transfer.description && (
                        <p className="text-gray-600 mt-1">{transfer.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{transfer.type === "SENT" ? "To:" : "From:"} {transfer.recipientEmail}</span>
                        <span>•</span>
                        <span>{format(new Date(transfer.createdAt), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${typeColor}`}>
                        {transfer.type === "SENT" ? "-" : "+"}${transfer.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {transfer.type.toLowerCase()}
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
                            setEditingTransfer(transfer)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Icons.edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTransfer(transfer.id)}
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
          )
        })}

        {filteredTransfers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icons.arrowUpRight className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers found</h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Get started by adding your first transfer."
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Icons.plus className="mr-2 h-4 w-4" />
                Add Transfer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
