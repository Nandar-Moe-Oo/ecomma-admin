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
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShoppingBagIcon,
  TagIcon,
} from "@heroicons/react/24/outline"

interface Seller {
  id: string
  name: string
  email: string
  status: "active" | "pending" | "suspended"
  joinDate: string
  productCount: number
}

interface Permission {
  id: string
  sellerId: string
  seller: Seller
  canPublishProducts: boolean
  canCreateCategories: boolean
  lastUpdated: string
}

export default function PermissionsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

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
        status: "active",
        joinDate: "2023-03-22",
        productCount: 18,
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
        status: "active",
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

    const mockPermissions: Permission[] = [
      {
        id: "1",
        sellerId: "1",
        seller: mockSellers[0],
        canPublishProducts: true,
        canCreateCategories: false,
        lastUpdated: "2023-05-10",
      },
      {
        id: "2",
        sellerId: "2",
        seller: mockSellers[1],
        canPublishProducts: true,
        canCreateCategories: true,
        lastUpdated: "2023-05-12",
      },
      {
        id: "3",
        sellerId: "3",
        seller: mockSellers[2],
        canPublishProducts: false,
        canCreateCategories: false,
        lastUpdated: "2023-05-15",
      },
      {
        id: "4",
        sellerId: "4",
        seller: mockSellers[3],
        canPublishProducts: true,
        canCreateCategories: false,
        lastUpdated: "2023-05-08",
      },
      {
        id: "5",
        sellerId: "5",
        seller: mockSellers[4],
        canPublishProducts: false,
        canCreateCategories: true,
        lastUpdated: "2023-05-14",
      },
    ]
    setPermissions(mockPermissions)
  }, [])

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const togglePermission = (
    permissionId: string,
    permissionType: "canPublishProducts" | "canCreateCategories"
  ) => {
    const permission = permissions.find(p => p.id === permissionId)
    if (!permission) return

    const newPermissionState = !permission[permissionType]
    const permissionName = permissionType === "canPublishProducts" 
      ? "product publishing" 
      : "category creation"
    
    setPermissions(
      permissions.map((permission) =>
        permission.id === permissionId
          ? { ...permission, [permissionType]: newPermissionState }
          : permission
      )
    )

    toast({
      title: "Permission Updated",
      description: `${permission.seller.name} has been ${newPermissionState ? "granted" : "revoked"} ${permissionName} permission.`,
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
        <h1 className="text-3xl font-bold tracking-tight">Seller Permissions</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Permission Rule
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
          <CardTitle>Permission Management</CardTitle>
          <CardDescription>
            Manage seller permissions for product publishing and category creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Product Publishing</TableHead>
                <TableHead>Category Creation</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <UserCircleIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                      {permission.seller.name}
                    </div>
                  </TableCell>
                  <TableCell>{permission.seller.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {permission.canPublishProducts ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <Badge
                        className={
                          permission.canPublishProducts
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }
                      >
                        {permission.canPublishProducts ? "Allowed" : "Not Allowed"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {permission.canCreateCategories ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <Badge
                        className={
                          permission.canCreateCategories
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }
                      >
                        {permission.canCreateCategories ? "Allowed" : "Not Allowed"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{permission.lastUpdated}</TableCell>
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
                          onClick={() => router.push(`/sellers/${permission.sellerId}`)}
                        >
                          <UserCircleIcon className="mr-2 h-4 w-4" />
                          View seller profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            togglePermission(permission.id, "canPublishProducts")
                          }
                        >
                          <ShoppingBagIcon className="mr-2 h-4 w-4" />
                          {permission.canPublishProducts
                            ? "Revoke product publishing"
                            : "Grant product publishing"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            togglePermission(permission.id, "canCreateCategories")
                          }
                        >
                          <TagIcon className="mr-2 h-4 w-4" />
                          {permission.canCreateCategories
                            ? "Revoke category creation"
                            : "Grant category creation"}
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