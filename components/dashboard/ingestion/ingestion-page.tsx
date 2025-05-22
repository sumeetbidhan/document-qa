"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2, Clock, Database, Loader2, RefreshCw } from "lucide-react"
import { type Document, mockDocumentService } from "@/lib/mock-services/document-service"

export function IngestionPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingDocuments, setProcessingDocuments] = useState<string[]>([])

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

  const handleStartIngestion = async (documentId: string) => {
    if (processingDocuments.includes(documentId)) return

    setProcessingDocuments((prev) => [...prev, documentId])
    try {
      const updatedDoc = await mockDocumentService.startIngestion(documentId)
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? updatedDoc : doc))
      )
      toast({
        title: "Success",
        description: "Document ingestion started",
      })

      // Poll for updates
      const intervalId = setInterval(async () => {
        const docs = await mockDocumentService.getDocuments(user?.id)
        const updatedDoc = docs.find((d) => d.id === documentId)
        
        if (updatedDoc && updatedDoc.status !== "processing") {
          clearInterval(intervalId)
          setDocuments((prev) =>
            prev.map((doc) => (doc.id === documentId ? updatedDoc : doc))
          )
          setProcessingDocuments((prev) =>
            prev.filter((id) => id !== documentId)
          )
          
          toast({
            title: updatedDoc.status === "indexed" ? "Success" : "Failed",
            description:
              updatedDoc.status === "indexed"
                ? "Document indexed successfully"
                : "Document ingestion failed",
            variant:
              updatedDoc.status === "indexed" ? "default" : "destructive",
          })
        }
      }, 2000)

      return () => clearInterval(intervalId)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start ingestion",
        variant: "destructive",
      })
      setProcessingDocuments((prev) => prev.filter((id) => id !== documentId))
    }
  }

  const handleRetryIngestion = async (documentId: string) => {
    if (processingDocuments.includes(documentId)) return

    setProcessingDocuments((prev) => [...prev, documentId])
    try {
      const updatedDoc = await mockDocumentService.retryIngestion(documentId)
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? updatedDoc : doc))
      )
      toast({
        title: "Success",
        description: "Document ingestion retry started",
      })

      // Poll for updates
      const intervalId = setInterval(async () => {
        const docs = await mockDocumentService.getDocuments(user?.id)
        const updatedDoc = docs.find((d) => d.id === documentId)
        
        if (updatedDoc && updatedDoc.status !== "processing") {
          clearInterval(intervalId)
          setDocuments((prev) =>
            prev.map((doc) => (doc.id === documentId ? updatedDoc : doc))
          )
          setProcessingDocuments((prev) =>
            prev.filter((id) => id !== documentId)
          )
          
          toast({
            title: updatedDoc.status === "indexed" ? "Success" : "Failed",
            description:
              updatedDoc.status === "indexed"
                ? "Document indexed successfully"
                : "Document ingestion failed",
            variant:
              updatedDoc.status === "indexed" ? "default" : "destructive",
          })
        }
      }, 2000)

      return () => clearInterval(intervalId)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry ingestion",
        variant: "destructive",
      })
      setProcessingDocuments((prev) => prev.filter((id) => id !== documentId))
    }
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "indexed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingestion</h1>
          <p className="text-muted-foreground">
            Manage document ingestion processes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchDocuments}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Ingestion</CardTitle>
          <CardDescription>
            Start or retry ingestion processes for your documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <Database className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No documents yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload documents first to start ingestion
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="capitalize">{doc.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleStartIngestion(doc.id)}
                            disabled={processingDocuments.includes(doc.id)}
                          >
                            {processingDocuments.includes(doc.id) ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Starting...
                              </>
                            ) : (
                              "Start Ingestion"
                            )}
                          </Button>
                        )}
                        {doc.status === "failed" && (
                          <Button
                            size="sm"
                            onClick={() => handleRetryIngestion(doc.id)}
                            disabled={processingDocuments.includes(doc.id)}
                          >
                            {processingDocuments.includes(doc.id) ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Retrying...
                              </>
                            ) : (
                              "Retry Ingestion"
                            )}
                          </Button>
                        )}
                        {doc.status === "processing" && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </div>
                        )}
                        {doc.status === "indexed" && (
                          <div className="flex items-center gap-2 text-sm text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                            Ready for Q&A
                          </div>
                        )}
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
