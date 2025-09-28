"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  UsersIcon,
  ShoppingBagIcon,
  TagIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ShoppingBagIcon,
  },
  {
    name: "Seller Management",
    href: "/sellers",
    icon: UsersIcon,
  },
  {
    name: "Product Reviews",
    href: "/products",
    icon: ShoppingBagIcon,
  },
  {
    name: "Category Reviews",
    href: "/categories",
    icon: TagIcon,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <ShoppingBagIcon className="h-6 w-6" />
            <span>E-Commerce Admin</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-sm">
            <div className="font-medium">{user?.name}</div>
            <div className="ml-auto text-xs text-muted-foreground">
              {user?.role}
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start mt-2"
            onClick={logout}
          >
            <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}