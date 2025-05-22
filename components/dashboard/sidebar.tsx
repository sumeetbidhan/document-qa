"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileText, Home, Upload, Database, Search, Users, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Documents",
      href: "/dashboard/documents",
      icon: Upload,
    },
    {
      name: "Ingestion",
      href: "/dashboard/ingestion",
      icon: Database,
    },
    {
      name: "Q&A",
      href: "/dashboard/qa",
      icon: Search,
    },
  ]

  // Only show admin link for admin users
  if (user?.role === "admin") {
    navItems.push({
      name: "User Management",
      href: "/dashboard/admin",
      icon: Users,
    })
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">DocuQuery AI</span>
          </div>

          <div className="flex flex-1 flex-col justify-between py-4">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="px-3">
              <div className="mb-2 space-y-1">
                <div className="flex items-center justify-between rounded-md px-3 py-2">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs font-medium capitalize text-primary">{user?.role}</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={closeSidebar} />}
    </>
  )
}
