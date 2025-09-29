"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline"

interface Category {
  id: string
  name: string
  description: string
  requestedBy: string
  requestedById: string
  status: "pending" | "approved" | "rejected"
  dateRequested: string
  parentCategory?: string
}

export default function CategoriesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Mock data - in a real app, this would be an API call
    const mockCategories: Category[] = [
      {
        id: "1",
        name: "Handmade Decor",
        description: "Handcrafted home decoration items",
        requestedBy: "John Doe",
        requestedById: "1",
        status: "pending",
        dateRequested: "2023-05-10",
        parentCategory: "Home",
      },
      {
        id: "2",
        name: "Vintage Clothing",
        description: "Clothing and accessories from past eras",
        requestedBy: "Jane Smith",
        requestedById: "2",
        status: "pending",
        dateRequested: "2023-05-12",
        parentCategory: "Clothing",
      },
      {
        id: "3",
        name: "Organic Skincare",
        description: "Natural and organic skincare products",
        requestedBy: "Robert Johnson",
        requestedById: "3",
        status: "approved",
        dateRequested: "2023-04-20",
        parentCategory: "Beauty",
      },
      {
        id: "4",
        name: "Pet Toys",
        description: "Toys and entertainment for pets",
        requestedBy: "Emily Davis",
        requestedById: "4",
        status: "rejected",
        dateRequested: "2023-04-15",
        parentCategory: "Pets",
      },
      {
        id: "5",
        name: "Smart Home Devices",
        description: "Connected devices for home automation",
        requestedBy: "Michael Wilson",
        requestedById: "5",
        status: "pending",
        dateRequested: "2023-05-15",
        parentCategory: "Electronics",
      },
    ]
    setCategories(mockCategories)
  }, [])

  const filteredCategories = categories.filter(
    (category) =>
      (category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || category.status === statusFilter)
  )

  const getStatusBadge = (status: Category["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Rejected
          </Badge>
        )
    }
  }

  const handleStatusChange = (categoryId: string, newStatus: Category["status"]) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    setCategories(
      categories.map((category) =>
        category.id === categoryId ? { ...category, status: newStatus } : category
      )
    )

    const statusMessage = newStatus === "approved" 
      ? "approved" 
      : newStatus === "rejected" 
        ? "rejected" 
        : "pending"

    toast({
      title: `Category ${statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1)}`,
      description: `The category "${category.name}" has been ${statusMessage}.`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Category Reviews</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 py-4">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Requests</CardTitle>
          <CardDescription>
            Review and approve category requests from sellers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <TagIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => router.push(`/sellers/${category.requestedById}`)}
                      className="text-blue-600 hover:underline"
                    >
                      {category.requestedBy}
                    </button>
                  </TableCell>
                  <TableCell>{category.parentCategory || "None"}</TableCell>
                  <TableCell>{getStatusBadge(category.status)}</TableCell>
                  <TableCell>{category.dateRequested}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(`/categories/${category.id}`)}
                        >
                          <EyeIcon className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {category.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(category.id, "approved")}
                            >
                              <CheckCircleIcon className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(category.id, "rejected")}
                            >
                              <XCircleIcon className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {category.status === "approved" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(category.id, "rejected")}
                          >
                            <XCircleIcon className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        {category.status === "rejected" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(category.id, "approved")}
                          >
                            <CheckCircleIcon className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}