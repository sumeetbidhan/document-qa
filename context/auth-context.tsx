"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { mockAuthService } from "@/lib/mock-services/auth-service"
import { useToast } from "@/components/ui/use-toast"

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const currentUser = await mockAuthService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const user = await mockAuthService.login(email, password)
      setUser(user)
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const user = await mockAuthService.signup(name, email, password)
      setUser(user)
      toast({
        title: "Signup successful",
        description: `Welcome, ${user.name}!`,
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Signup failed",
        description: (error as Error).message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    mockAuthService.logout()
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
