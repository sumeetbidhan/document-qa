"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileText, Search, Upload, Database, Users } from "lucide-react"

export function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">DocuQuery AI</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              AI-Powered Document Q&A System
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Upload your documents and get instant answers to your questions using our advanced AI technology.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={user ? "/dashboard" : "/signup"}>{user ? "Go to Dashboard" : "Get Started"}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={user ? "/dashboard/qa" : "/login"}>{user ? "Ask Questions" : "Login"}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Document Upload</h3>
              <p className="text-muted-foreground">
                Easily upload your documents in various formats including PDF, DOCX, and TXT.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Intelligent Ingestion</h3>
              <p className="text-muted-foreground">
                Our system processes and indexes your documents for efficient retrieval and analysis.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI-Powered Q&A</h3>
              <p className="text-muted-foreground">
                Ask questions in natural language and get accurate answers with source references.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">User Management</h3>
              <p className="text-muted-foreground">
                Administrators can manage users and assign appropriate roles and permissions.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} DocuQuery AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium underline underline-offset-4">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
