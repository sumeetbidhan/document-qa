export type QAResponse = {
  answer: string
  sources: {
    documentId: string
    documentName: string
    excerpt: string
    relevance: number
  }[]
  processingTime: number
}

// Mock QA database with predefined Q&A pairs
const qaDatabase: Record<string, QAResponse> = {
  "what is in the annual report": {
    answer:
      "The Annual Report 2023 contains financial statements, management discussion and analysis, corporate governance information, and highlights of the company's performance for the fiscal year 2023. It shows a 15% revenue growth compared to the previous year and outlines strategic initiatives for 2024.",
    sources: [
      {
        documentId: "1",
        documentName: "Annual Report 2023.pdf",
        excerpt:
          "Financial statements show a 15% revenue growth compared to FY2022, with EBITDA margins improving by 2.3 percentage points.",
        relevance: 0.92,
      },
      {
        documentId: "1",
        documentName: "Annual Report 2023.pdf",
        excerpt:
          "Strategic initiatives for 2024 include expansion into Asian markets and launch of new product lines in Q2 and Q3.",
        relevance: 0.85,
      },
    ],
    processingTime: 0.82,
  },
  "product specifications": {
    answer:
      "The Product Specifications document details technical requirements, dimensions, materials, performance metrics, and compliance standards for our product line. It includes specifications for the X200, X300, and X500 models, with the X500 being our premium offering featuring advanced capabilities.",
    sources: [
      {
        documentId: "2",
        documentName: "Product Specifications.pdf",
        excerpt:
          "X500 model specifications: dimensions 45cm x 30cm x 15cm, weight 2.3kg, power consumption 120W, operating temperature -10°C to 50°C.",
        relevance: 0.95,
      },
      {
        documentId: "2",
        documentName: "Product Specifications.pdf",
        excerpt:
          "All models comply with ISO 9001:2015 quality standards and have passed rigorous durability testing (10,000 cycle stress test).",
        relevance: 0.78,
      },
    ],
    processingTime: 0.65,
  },
  "research findings": {
    answer:
      "The Research Paper discusses findings from our latest study on market trends and consumer behavior. Key insights include a shift toward sustainable products among millennials, increasing demand for digital integration, and price sensitivity in emerging markets. The research methodology combined quantitative surveys with qualitative focus groups across 5 countries.",
    sources: [
      {
        documentId: "3",
        documentName: "Research Paper.pdf",
        excerpt:
          "Survey results indicate 73% of millennials are willing to pay a premium for products with verifiable sustainability credentials.",
        relevance: 0.91,
      },
      {
        documentId: "3",
        documentName: "Research Paper.pdf",
        excerpt:
          "Focus groups in emerging markets revealed price sensitivity as the primary decision factor, followed by durability and after-sales support.",
        relevance: 0.87,
      },
    ],
    processingTime: 0.93,
  },
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockQAService = {
  async askQuestion(question: string): Promise<QAResponse> {
    // Simulate thinking time
    await delay(1500 + Math.random() * 1500)

    // Normalize question by removing punctuation and converting to lowercase
    const normalizedQuestion = question.toLowerCase().replace(/[^\w\s]/g, "")

    // Find the best matching predefined question
    let bestMatch: string | null = null
    let highestMatchScore = 0

    for (const key of Object.keys(qaDatabase)) {
      // Simple matching algorithm - count how many words from the key appear in the question
      const keyWords = key.split(" ")
      let matchScore = 0

      for (const word of keyWords) {
        if (normalizedQuestion.includes(word)) {
          matchScore++
        }
      }

      // Normalize score by dividing by the number of words in the key
      const normalizedScore = matchScore / keyWords.length

      if (normalizedScore > highestMatchScore) {
        highestMatchScore = normalizedScore
        bestMatch = key
      }
    }

    // If we have a decent match, return the predefined answer
    if (bestMatch && highestMatchScore > 0.3) {
      return qaDatabase[bestMatch]
    }

    // Fallback response if no good match is found
    return {
      answer:
        "I couldn't find specific information about that in the indexed documents. Could you try rephrasing your question or asking about another topic covered in the documents?",
      sources: [],
      processingTime: 0.45,
    }
  },
}
