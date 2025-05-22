export type Document = {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  status: "pending" | "processing" | "indexed" | "failed"
  userId: string
}

// Mock documents database
let documents: Document[] = [
  {
    id: "1",
    name: "Annual Report 2023.pdf",
    type: "application/pdf",
    size: 2500000,
    uploadedAt: "2023-12-01T10:30:00Z",
    status: "indexed",
    userId: "1",
  },
  {
    id: "2",
    name: "Product Specifications.pdf",
    type: "application/pdf",
    size: 1800000,
    uploadedAt: "2023-12-05T14:20:00Z",
    status: "indexed",
    userId: "1",
  },
  {
    id: "3",
    name: "Research Paper.pdf",
    type: "application/pdf",
    size: 3200000,
    uploadedAt: "2023-12-10T09:15:00Z",
    status: "processing",
    userId: "2",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockDocumentService = {
  async getDocuments(userId?: string): Promise<Document[]> {
    await delay(800) // Simulate network delay

    if (userId) {
      return documents.filter((doc) => doc.userId === userId)
    }
    return [...documents]
  },

  async uploadDocument(file: { name: string; type: string; size: number }, userId: string): Promise<Document> {
    await delay(1200) // Simulate network delay and upload time

    const newDocument: Document = {
      id: `${documents.length + 1}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: "pending",
      userId,
    }

    documents.push(newDocument)
    return newDocument
  },

  async deleteDocument(documentId: string): Promise<void> {
    await delay(500) // Simulate network delay

    const index = documents.findIndex((doc) => doc.id === documentId)
    if (index === -1) {
      throw new Error("Document not found")
    }

    documents = documents.filter((doc) => doc.id !== documentId)
  },

  async startIngestion(documentId: string): Promise<Document> {
    await delay(500) // Simulate network delay

    const index = documents.findIndex((doc) => doc.id === documentId)
    if (index === -1) {
      throw new Error("Document not found")
    }

    documents[index] = {
      ...documents[index],
      status: "processing",
    }

    // Simulate processing completion after some time
    setTimeout(
      () => {
        const docIndex = documents.findIndex((doc) => doc.id === documentId)
        if (docIndex !== -1) {
          documents[docIndex] = {
            ...documents[docIndex],
            status: Math.random() > 0.1 ? "indexed" : "failed", // 10% chance of failure
          }
        }
      },
      5000 + Math.random() * 5000,
    ) // Random processing time between 5-10 seconds

    return documents[index]
  },

  async retryIngestion(documentId: string): Promise<Document> {
    await delay(500) // Simulate network delay

    const index = documents.findIndex((doc) => doc.id === documentId)
    if (index === -1) {
      throw new Error("Document not found")
    }

    documents[index] = {
      ...documents[index],
      status: "processing",
    }

    // Simulate processing completion after some time
    setTimeout(
      () => {
        const docIndex = documents.findIndex((doc) => doc.id === documentId)
        if (docIndex !== -1) {
          documents[docIndex] = {
            ...documents[docIndex],
            status: "indexed", // Higher chance of success on retry
          }
        }
      },
      3000 + Math.random() * 3000,
    ) // Faster processing on retry

    return documents[index]
  },
}
