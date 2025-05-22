"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Trash2, FileText, AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { type Document, mockDocumentService } from "@/lib/mock-services/document-service"
import { formatFileSize } from "@/lib/utils"

export function DocumentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const docs = await mockDocumentService.getDocuments(user?.id)
      setDocuments(docs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length || !user) return

    setIsUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const newDoc = await mockDocumentService.uploadDocument(
          {
            name: file.name,
            type: file.type,
            size: file.size,
          },
          user.id,
        )
        setDocuments((prev) => [...prev, newDoc])
      }
      toast({
        title: "Success",
        description: `${files.length} document(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      e.target.value = ""
    }
  }

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return

    try {
      await mockDocumentService.deleteDocument(documentToDelete.id)
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentToDelete.id))
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    } finally {
      setDocumentToDelete(null)
    }
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "indexed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "processing":
        return <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Upload and manage your documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={isUploading}>
            <label className="flex cursor-pointer items-center gap-2">
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Document"}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Manage your uploaded documents and their processing status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No documents yet</h3>
              <p className="text-sm text-muted-foreground">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{formatFileSize(doc.size)}</TableCell>
                      <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="capitalize">{doc.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setDocumentToDelete(doc)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document &quot;
              {documentToDelete?.name}&quot; and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
