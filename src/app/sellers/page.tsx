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
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"

interface Seller {
  id: string
  name: string
  email: string
  status: "active" | "pending" | "suspended"
  joinDate: string
  productCount: number
}

export default function SellersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [sellers, setSellers] = useState<Seller[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Mock data - in a real app, this would be an API call
    const mockSellers: Seller[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        status: "active",
        joinDate: "2023-01-15",
        productCount: 24,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        status: "pending",
        joinDate: "2023-03-22",
        productCount: 0,
      },
      {
        id: "3",
        name: "Robert Johnson",
        email: "robert@example.com",
        status: "active",
        joinDate: "2023-02-10",
        productCount: 12,
      },
      {
        id: "4",
        name: "Emily Davis",
        email: "emily@example.com",
        status: "suspended",
        joinDate: "2023-01-05",
        productCount: 8,
      },
      {
        id: "5",
        name: "Michael Wilson",
        email: "michael@example.com",
        status: "active",
        joinDate: "2023-04-18",
        productCount: 16,
      },
    ]
    setSellers(mockSellers)
  }, [])

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: Seller["status"]) => {
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Seller Management</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Seller
        </Button>
      </div>
      <div className="flex items-center space-x-2 py-4">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Sellers</CardTitle>
          <CardDescription>
            Manage seller accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <UserCircleIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                      {seller.name}
                    </div>
                  </TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{getStatusBadge(seller.status)}</TableCell>
                  <TableCell>{seller.joinDate}</TableCell>
                  <TableCell>{seller.productCount}</TableCell>
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
                          onClick={() => router.push(`/sellers/${seller.id}`)}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {seller.status === "pending" && (
                          <>
                            <DropdownMenuItem>
                              <CheckCircleIcon className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <XCircleIcon className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {seller.status === "active" && (
                          <DropdownMenuItem>
                            <XCircleIcon className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        {seller.status === "suspended" && (
                          <DropdownMenuItem>
                            <CheckCircleIcon className="mr-2 h-4 w-4" />
                            Activate
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