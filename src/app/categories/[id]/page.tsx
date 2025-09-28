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
  TagIcon,
  CalendarIcon,
  EnvelopeIcon,
  FolderIcon,
} from "@heroicons/react/24/outline"

interface Category {
  id: string
  name: string
  description: string
  requestedBy: string
  requestedById: string
  requestedByEmail: string
  status: "pending" | "approved" | "rejected"
  dateRequested: string
  parentCategory?: string
  justification: string
  proposedAttributes: string[]
}

export default function CategoryDetailPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const [category, setCategory] = useState<Category | null>(null)
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
    const mockCategory: Category = {
      id: categoryId,
      name: "Handmade Decor",
      description: "Handcrafted home decoration items made by artisans",
      requestedBy: "John Doe",
      requestedById: "1",
      requestedByEmail: "john@example.com",
      status: "pending",
      dateRequested: "2023-05-10",
      parentCategory: "Home",
      justification: "There is a growing market for handmade home decor items that don't fit well into existing categories. This new category would help customers find unique, handcrafted items more easily.",
      proposedAttributes: [
        "Material",
        "Crafting Technique",
        "Dimensions",
        "Care Instructions",
        "Origin",
      ],
    }

    setCategory(mockCategory)
  }, [categoryId])

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

  const handleApprove = async () => {
    if (!category) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setCategory({ ...category, status: "approved" })
    setIsSubmitting(false)
    
    toast({
      title: "Category Approved",
      description: `${category.name} has been approved and is now available on the platform.`,
    })
  }

  const handleReject = async () => {
    if (!category || !feedback.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setCategory({ ...category, status: "rejected" })
    setIsSubmitting(false)
    
    toast({
      title: "Category Rejected",
      description: `${category.name} has been rejected. Feedback has been sent to the requester.`,
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

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Category not found</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/categories")}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Category Review</h1>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(category.status)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>
              Details about the category request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Parent Category:</span>
                  <span>{category.parentCategory || "None"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Requested:</span>
                  <span>{category.dateRequested}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Justification</h4>
              <p className="text-muted-foreground">{category.justification}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Proposed Attributes</h4>
              <div className="flex flex-wrap gap-2">
                {category.proposedAttributes.map((attribute, index) => (
                  <Badge key={index} variant="outline">
                    {attribute}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requester Information</CardTitle>
            <CardDescription>
              Details about the seller who requested this category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">{category.requestedBy}</h3>
                <button
                  onClick={() => router.push(`/sellers/${category.requestedById}`)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View seller profile
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
              <span>{category.requestedByEmail}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {category.status === "pending" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Review Decision</CardTitle>
            <CardDescription>
              Approve or reject this category request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Feedback (required for rejection)</label>
              <Textarea
                placeholder="Provide feedback to the requester..."
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
                {isSubmitting ? "Processing..." : "Approve Category"}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isSubmitting || !feedback.trim()}
                variant="destructive"
              >
                <XCircleIcon className="mr-2 h-4 w-4" />
                {isSubmitting ? "Processing..." : "Reject Category"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {category.status === "approved" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Approval Details</CardTitle>
            <CardDescription>
              This category has been approved and is now available on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircleIcon className="h-5 w-5" />
              <span>Category approved on {new Date().toLocaleDateString()}</span>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Category Path</h4>
              <div className="flex items-center space-x-1 text-sm">
                <FolderIcon className="h-4 w-4" />
                <span>{category.parentCategory}</span>
                <span>/</span>
                <span className="font-medium">{category.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {category.status === "rejected" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Rejection Details</CardTitle>
            <CardDescription>
              This category has been rejected with the following feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircleIcon className="h-5 w-5" />
              <span>Category rejected on {new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <h4 className="font-medium mb-2">Feedback to requester:</h4>
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