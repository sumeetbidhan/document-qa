"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Loader2, Search, SendHorizontal, Sparkles } from "lucide-react"
import { type QAResponse, mockQAService } from "@/lib/mock-services/qa-service"

export function QAPage() {
  const { toast } = useToast()
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<QAResponse | null>(null)
  const [history, setHistory] = useState<{ question: string; response: QAResponse }[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || isLoading) return

    setIsLoading(true)
    try {
      const qaResponse = await mockQAService.askQuestion(question)
      setResponse(qaResponse)
      setHistory((prev) => [{ question, response: qaResponse }, ...prev])
      setQuestion("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get an answer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleHistoryItemClick = (item: {
    question: string
    response: QAResponse
  }) => {
    setQuestion(item.question)
    setResponse(item.response)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Q&A</h1>
          <p className="text-muted-foreground">Ask questions about your documents</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>Ask any question about your indexed documents</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="e.g., What is in the annual report?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={!question.trim() || isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>

          {isLoading && (
            <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Searching documents and generating answer...</p>
              </div>
            </div>
          )}

          {response && !isLoading && (
            <Card>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Sparkles className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Answer</CardTitle>
                  <CardDescription>Processed in {response.processingTime.toFixed(2)}s</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea className="min-h-[200px] resize-none" readOnly value={response.answer} />
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <h4 className="mb-2 text-sm font-medium">Sources</h4>
                {response.sources.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {response.sources.map((source, index) => (
                      <AccordionItem key={index} value={`source-${index}`} className="border-b">
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{source.documentName}</span>
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              {(source.relevance * 100).toFixed(0)}% match
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="rounded-md bg-muted p-3 text-sm">{source.excerpt}</div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific sources found for this answer.</p>
                )}
              </CardFooter>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Questions</CardTitle>
              <CardDescription>Your recent questions and answers</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Your question history will appear here</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {history.map((item, index) => (
                    <li key={index}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => handleHistoryItemClick(item)}
                      >
                        <div className="truncate">{item.question}</div>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
