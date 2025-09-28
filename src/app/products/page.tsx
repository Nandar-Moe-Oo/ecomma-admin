"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
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
  ShoppingBagIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline"

interface Product {
  id: string
  name: string
  seller: string
  sellerId: string
  category: string
  price: number
  status: "pending" | "approved" | "rejected"
  dateSubmitted: string
  description: string
}

export default function ProductsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Mock data - in a real app, this would be an API call
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        seller: "John Doe",
        sellerId: "1",
        category: "Electronics",
        price: 99.99,
        status: "pending",
        dateSubmitted: "2023-05-10",
        description: "High-quality wireless headphones with noise cancellation.",
      },
      {
        id: "2",
        name: "Smart Fitness Watch",
        seller: "Jane Smith",
        sellerId: "2",
        category: "Electronics",
        price: 149.99,
        status: "pending",
        dateSubmitted: "2023-05-12",
        description: "Track your fitness goals with this advanced smartwatch.",
      },
      {
        id: "3",
        name: "Organic Cotton T-Shirt",
        seller: "Robert Johnson",
        sellerId: "3",
        category: "Clothing",
        price: 24.99,
        status: "approved",
        dateSubmitted: "2023-04-20",
        description: "Comfortable and sustainable organic cotton t-shirt.",
      },
      {
        id: "4",
        name: "Ceramic Coffee Mug",
        seller: "Emily Davis",
        sellerId: "4",
        category: "Home",
        price: 14.99,
        status: "rejected",
        dateSubmitted: "2023-04-15",
        description: "Handcrafted ceramic mug perfect for your morning coffee.",
      },
      {
        id: "5",
        name: "Leather Wallet",
        seller: "Michael Wilson",
        sellerId: "5",
        category: "Accessories",
        price: 39.99,
        status: "pending",
        dateSubmitted: "2023-05-15",
        description: "Genuine leather wallet with multiple card slots.",
      },
    ]
    setProducts(mockProducts)
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || product.status === statusFilter)
  )

  const getStatusBadge = (status: Product["status"]) => {
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

  const handleStatusChange = (productId: string, newStatus: Product["status"]) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, status: newStatus } : product
      )
    )
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
        <h1 className="text-3xl font-bold tracking-tight">Product Reviews</h1>
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Submissions</CardTitle>
          <CardDescription>
            Review and approve product submissions from sellers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <ShoppingBagIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => router.push(`/sellers/${product.sellerId}`)}
                      className="text-blue-600 hover:underline"
                    >
                      {product.seller}
                    </button>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>{product.dateSubmitted}</TableCell>
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
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
                          <EyeIcon className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {product.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(product.id, "approved")}
                            >
                              <CheckCircleIcon className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(product.id, "rejected")}
                            >
                              <XCircleIcon className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {product.status === "approved" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(product.id, "rejected")}
                          >
                            <XCircleIcon className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        {product.status === "rejected" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(product.id, "approved")}
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