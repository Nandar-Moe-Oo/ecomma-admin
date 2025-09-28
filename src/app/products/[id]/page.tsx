"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  TagIcon,
  CalendarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline"

interface Product {
  id: string
  name: string
  seller: string
  sellerId: string
  sellerEmail: string
  category: string
  price: number
  status: "pending" | "approved" | "rejected"
  dateSubmitted: string
  description: string
  images: string[]
  specifications: Record<string, string>
}

export default function ProductDetailPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Mock data - in a real app, this would be an API call
    const mockProduct: Product = {
      id: productId,
      name: "Wireless Bluetooth Headphones",
      seller: "John Doe",
      sellerId: "1",
      sellerEmail: "john@example.com",
      category: "Electronics",
      price: 99.99,
      status: "pending",
      dateSubmitted: "2023-05-10",
      description: "High-quality wireless headphones with noise cancellation technology. Features include 30-hour battery life, comfortable over-ear design, and premium sound quality.",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      specifications: {
        "Battery Life": "30 hours",
        "Connectivity": "Bluetooth 5.0",
        "Noise Cancellation": "Active",
        "Weight": "250g",
        "Color": "Black",
        "Warranty": "2 years",
      },
    }

    setProduct(mockProduct)
  }, [productId])

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

  const handleApprove = async () => {
    if (!product) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setProduct({ ...product, status: "approved" })
    setIsSubmitting(false)
    
    toast({
      title: "Product Approved",
      description: `${product.name} has been approved and is now live on the platform.`,
    })
  }

  const handleReject = async () => {
    if (!product || !feedback.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setProduct({ ...product, status: "rejected" })
    setIsSubmitting(false)
    
    toast({
      title: "Product Rejected",
      description: `${product.name} has been rejected. Feedback has been sent to the seller.`,
      variant: "destructive",
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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Product not found</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/products")}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Product Review</h1>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(product.status)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Details about the product submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ShoppingBagIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Price:</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Submitted:</span>
                  <span>{product.dateSubmitted}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Product Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 border-b">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
            <CardDescription>
              Details about the seller who submitted this product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">{product.seller}</h3>
                <button
                  onClick={() => router.push(`/sellers/${product.sellerId}`)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View seller profile
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
              <span>{product.sellerEmail}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {product.status === "pending" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Review Decision</CardTitle>
            <CardDescription>
              Approve or reject this product submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Feedback (required for rejection)</label>
              <Textarea
                placeholder="Provide feedback to the seller..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                {isSubmitting ? "Processing..." : "Approve Product"}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isSubmitting || !feedback.trim()}
                variant="destructive"
              >
                <XCircleIcon className="mr-2 h-4 w-4" />
                {isSubmitting ? "Processing..." : "Reject Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {product.status === "approved" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Approval Details</CardTitle>
            <CardDescription>
              This product has been approved and is now live on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircleIcon className="h-5 w-5" />
              <span>Product approved on {new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {product.status === "rejected" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Rejection Details</CardTitle>
            <CardDescription>
              This product has been rejected with the following feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircleIcon className="h-5 w-5" />
              <span>Product rejected on {new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <h4 className="font-medium mb-2">Feedback to seller:</h4>
              <p className="text-muted-foreground">
                {feedback || "No feedback provided."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}