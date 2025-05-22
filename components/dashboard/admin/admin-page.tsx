"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw, Shield, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockAuthService } from "@/lib/mock-services/auth-service"
import type { User as UserType } from "@/context/auth-context"

export function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingUsers, setUpdatingUsers] = useState<string[]>([])

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [user, router, toast])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const allUsers = await mockAuthService.getAllUsers()
      setUsers(allUsers)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role])

  const handleRoleChange = async (userId: string, role: "admin" | "user") => {
    setUpdatingUsers((prev) => [...prev, userId])
    try {
      const updatedUser = await mockAuthService.updateUserRole(userId, role)
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)))
      toast({
        title: "Success",
        description: `User role updated to ${role}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setUpdatingUsers((prev) => prev.filter((id) => id !== userId))
    }
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchUsers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {u.role === "admin" ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="capitalize">{u.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={u.role}
                            onValueChange={(value) => handleRoleChange(u.id, value as "admin" | "user")}
                            disabled={updatingUsers.includes(u.id) || u.id === user?.id}
                          >
                            <SelectTrigger className="w-32">
                              {updatingUsers.includes(u.id) ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Updating...</span>
                                </div>
                              ) : (
                                <SelectValue placeholder="Select role" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          {u.id === user?.id && <span className="text-xs text-muted-foreground">(Current user)</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
