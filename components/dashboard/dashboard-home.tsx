"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, Database, Search, Users, ArrowRight } from "lucide-react"
import { mockDocumentService } from "@/lib/mock-services/document-service"

export function DashboardHome() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalDocuments: 0,
    indexedDocuments: 0,
    processingDocuments: 0,
    pendingDocuments: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const documents = await mockDocumentService.getDocuments(user?.id)

        setStats({
          totalDocuments: documents.length,
          indexedDocuments: documents.filter((d) => d.status === "indexed").length,
          processingDocuments: documents.filter((d) => d.status === "processing").length,
          pendingDocuments: documents.filter((d) => d.status === "pending").length,
        })
      } catch (error) {
        console.error("Error fetching document stats:", error)
      }
    }

    fetchStats()
  }, [user?.id])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Indexed Documents</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.indexedDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processing Documents</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDocuments}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>Upload new documents to be processed and indexed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-20 items-center justify-center rounded-md border-2 border-dashed">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/documents">
                Go to Documents <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Ingestion</CardTitle>
            <CardDescription>Monitor and manage document ingestion processes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-20 items-center justify-center rounded-md border-2 border-dashed">
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/ingestion">
                Go to Ingestion <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ask Questions</CardTitle>
            <CardDescription>Ask questions about your documents and get AI-powered answers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-20 items-center justify-center rounded-md border-2 border-dashed">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/qa">
                Go to Q&A <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {user?.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their roles in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center rounded-md border-2 border-dashed">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/admin">
                  Manage Users <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
