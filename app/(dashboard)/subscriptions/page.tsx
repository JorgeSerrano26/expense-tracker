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
import { SubscriptionForm } from "@/components/forms/subscription-form"
import { toast } from "sonner"
import { format, addDays, addWeeks, addMonths, addYears } from "date-fns"

// Mock data - replace with actual API calls
const mockSubscriptions = [
  {
    id: "1",
    name: "Netflix",
    description: "Video streaming service",
    amount: 15.99,
    frequency: "MONTHLY" as const,
    nextPayment: "2024-02-15",
    isActive: true,
    category: "Entertainment",
  },
  {
    id: "2",
    name: "Spotify Premium",
    description: "Music streaming",
    amount: 9.99,
    frequency: "MONTHLY" as const,
    nextPayment: "2024-02-10",
    isActive: true,
    category: "Entertainment",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    description: "Design software suite",
    amount: 52.99,
    frequency: "MONTHLY" as const,
    nextPayment: "2024-02-20",
    isActive: true,
    category: "Software",
  },
  {
    id: "4",
    name: "Gym Membership",
    description: "Local fitness center",
    amount: 39.99,
    frequency: "MONTHLY" as const,
    nextPayment: "2024-02-05",
    isActive: false,
    category: "Health",
  },
]

const categories = [
  "All Categories",
  "Entertainment",
  "Software",
  "Health",
  "News",
  "Productivity",
  "Other"
]

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<typeof mockSubscriptions[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleAddSubscription = (subscriptionData: any) => {
    const newSubscription = {
      id: Date.now().toString(),
      ...subscriptionData,
      createdAt: new Date().toISOString(),
    }
    setSubscriptions([newSubscription, ...subscriptions])
    setIsDialogOpen(false)
    toast.success("Subscription added successfully!")
  }

  const handleEditSubscription = (subscriptionData: any) => {
    setSubscriptions(subscriptions.map(subscription => 
      subscription.id === editingSubscription?.id 
        ? { ...subscription, ...subscriptionData }
        : subscription
    ))
    setEditingSubscription(null)
    setIsDialogOpen(false)
    toast.success("Subscription updated successfully!")
  }

  const handleDeleteSubscription = (subscriptionId: string) => {
    setSubscriptions(subscriptions.filter(subscription => subscription.id !== subscriptionId))
    toast.success("Subscription deleted successfully!")
  }

  const handleToggleStatus = (subscriptionId: string) => {
    setSubscriptions(subscriptions.map(subscription => 
      subscription.id === subscriptionId 
        ? { ...subscription, isActive: !subscription.isActive }
        : subscription
    ))
    toast.success("Subscription status updated!")
  }

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || subscription.category === selectedCategory
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && subscription.isActive) ||
                         (statusFilter === "inactive" && !subscription.isActive)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const activeSubscriptions = subscriptions.filter(sub => sub.isActive)
  const monthlyTotal = activeSubscriptions.reduce((sum, sub) => {
    const multiplier = sub.frequency === "WEEKLY" ? 4.33 : 
                      sub.frequency === "MONTHLY" ? 1 :
                      sub.frequency === "QUARTERLY" ? 0.33 :
                      sub.frequency === "YEARLY" ? 0.083 : 1
    return sum + (sub.amount * multiplier)
  }, 0)

  const getFrequencyBadgeVariant = (frequency: string) => {
    switch (frequency) {
      case "WEEKLY": return "secondary"
      case "MONTHLY": return "default"
      case "QUARTERLY": return "outline"
      case "YEARLY": return "destructive"
      default: return "default"
    }
  }

  const getDaysUntilNextPayment = (nextPayment: string) => {
    const today = new Date()
    const paymentDate = new Date(nextPayment)
    const diffTime = paymentDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Manage your recurring payments</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSubscription(null)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSubscription ? "Edit Subscription" : "Add New Subscription"}
              </DialogTitle>
              <DialogDescription>
                {editingSubscription 
                  ? "Update your subscription information below."
                  : "Add a new recurring subscription to track."
                }
              </DialogDescription>
            </DialogHeader>
            <SubscriptionForm
              initialData={editingSubscription}
              onSubmit={editingSubscription ? handleEditSubscription : handleAddSubscription}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingSubscription(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${monthlyTotal.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated monthly cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeSubscriptions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {subscriptions.filter(sub => !sub.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Paused or cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Yearly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${(monthlyTotal * 12).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Annual estimate
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
                placeholder="Search subscriptions..."
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {filteredSubscriptions.map((subscription) => {
          const daysUntil = getDaysUntilNextPayment(subscription.nextPayment)
          
          return (
            <Card key={subscription.id} className={!subscription.isActive ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${subscription.isActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
                      <Icons.repeat className={`h-6 w-6 ${subscription.isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{subscription.name}</h3>
                        <Badge variant={getFrequencyBadgeVariant(subscription.frequency)}>
                          {subscription.frequency}
                        </Badge>
                        {!subscription.isActive && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      
                      {subscription.description && (
                        <p className="text-gray-600 mt-1">{subscription.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{subscription.category}</span>
                        <span>•</span>
                        <span>
                          Next payment: {format(new Date(subscription.nextPayment), "MMM dd, yyyy")}
                        </span>
                        {subscription.isActive && (
                          <>
                            <span>•</span>
                            <span className={daysUntil <= 3 ? "text-red-600 font-medium" : ""}>
                              {daysUntil <= 0 ? "Due today" : 
                               daysUntil === 1 ? "Due tomorrow" : 
                               `${daysUntil} days`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        ${subscription.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        per {subscription.frequency.toLowerCase().slice(0, -2)}
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
                            setEditingSubscription(subscription)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Icons.edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(subscription.id)}
                        >
                          {subscription.isActive ? (
                            <>
                              <Icons.eyeOff className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Icons.eye className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSubscription(subscription.id)}
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

        {filteredSubscriptions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icons.repeat className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm || selectedCategory !== "All Categories" 
                  ? "Try adjusting your filters to see more results."
                  : "Get started by adding your first subscription."
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Icons.plus className="mr-2 h-4 w-4" />
                Add Subscription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
