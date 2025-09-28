"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline"

interface Seller {
  id: string
  name: string
  email: string
  phone: string
  status: "active" | "pending" | "suspended"
  joinDate: string
  address: string
  productCount: number
  totalSales: number
  description: string
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  status: "active" | "pending" | "rejected"
  dateAdded: string
}

export default function SellerDetailPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const sellerId = params.id as string
  const [seller, setSeller] = useState<Seller | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Seller>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Mock data - in a real app, this would be an API call
    const mockSeller: Seller = {
      id: sellerId,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      joinDate: "2023-01-15",
      address: "123 Main St, New York, NY 10001",
      productCount: 24,
      totalSales: 15420,
      description: "Experienced seller specializing in electronics and gadgets.",
    }

    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Wireless Headphones",
        category: "Electronics",
        price: 99.99,
        status: "active",
        dateAdded: "2023-02-10",
      },
      {
        id: "2",
        name: "Smart Watch",
        category: "Electronics",
        price: 199.99,
        status: "active",
        dateAdded: "2023-03-15",
      },
      {
        id: "3",
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 49.99,
        status: "pending",
        dateAdded: "2023-04-20",
      },
    ]

    setSeller(mockSeller)
    setProducts(mockProducts)
    setEditForm(mockSeller)
  }, [sellerId])

  const getStatusBadge = (status: Seller["status"] | Product["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Suspended
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

  const handleSave = () => {
    if (seller) {
      setSeller({ ...seller, ...editForm } as Seller)
      setIsEditing(false)
      
      toast({
        title: "Profile Updated",
        description: `${seller.name}'s profile has been updated successfully.`,
      })
    }
  }

  const handleCancel = () => {
    if (seller) {
      setEditForm(seller)
      setIsEditing(false)
    }
  }

  const handleStatusChange = (newStatus: Seller["status"]) => {
    if (seller) {
      setSeller({ ...seller, status: newStatus })
      
      let statusMessage = ""
      if (newStatus === "active") {
        statusMessage = seller.status === "pending" ? "approved" : "activated"
      } else if (newStatus === "suspended") {
        statusMessage = seller.status === "pending" ? "rejected" : "suspended"
      }
      
      toast({
        title: `Seller ${statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1)}`,
        description: `${seller.name} has been ${statusMessage}.`,
        variant: newStatus === "active" ? "default" : "destructive",
      })
    }
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

  if (!seller) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Seller not found</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/sellers")}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Sellers
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Seller Details</h1>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {seller.status === "pending" && (
                <>
                  <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    Approve Seller
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("suspended")}>
                    <XCircleIcon className="mr-2 h-4 w-4" />
                    Reject Seller
                  </DropdownMenuItem>
                </>
              )}
              {seller.status === "active" && (
                <DropdownMenuItem onClick={() => handleStatusChange("suspended")}>
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  Suspend Seller
                </DropdownMenuItem>
              )}
              {seller.status === "suspended" && (
                <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  Activate Seller
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Basic information about the seller
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <UserCircleIcon className="h-16 w-16 text-muted-foreground" />
              <div>
                <h2 className="text-xl font-semibold">{seller.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(seller.status)}
                  <span className="text-sm text-muted-foreground">
                    Joined {seller.joinDate}
                  </span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={editForm.address || ""}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{seller.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{seller.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{seller.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span>Joined {seller.joinDate}</span>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">{seller.description}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Statistics</CardTitle>
            <CardDescription>
              Performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBagIcon className="h-5 w-5 text-muted-foreground" />
                <span>Products</span>
              </div>
              <span className="font-semibold">{seller.productCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Sales</span>
              <span className="font-semibold">${seller.totalSales.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Order Value</span>
              <span className="font-semibold">
                ${(seller.totalSales / seller.productCount).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Products listed by this seller
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>{product.dateAdded}</TableCell>
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
                          View details
                        </DropdownMenuItem>
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