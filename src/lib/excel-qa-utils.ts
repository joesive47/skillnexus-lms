// In-memory storage for Excel Q&A (in production, use database)
let excelQADatabase: Array<{
  id: string
  question: string
  answer: string
  category: string
  source: 'excel'
  createdAt: string
}> = []

// Function to search Excel Q&A
export function searchExcelQA(query: string): string | null {
  const q = query.toLowerCase()
  
  for (const item of excelQADatabase) {
    if (item.question.toLowerCase().includes(q) || 
        item.answer.toLowerCase().includes(q)) {
      return item.answer
    }
  }
  
  return null
}

// Function to get all Excel Q&A
export function getAllExcelQA() {
  return excelQADatabase
}

// Function to add items to Excel Q&A database
export function addExcelQAItems(items: Array<{
  id: string
  question: string
  answer: string
  category: string
  source: 'excel'
  createdAt: string
}>) {
  excelQADatabase.push(...items)
}

// Function to get database stats
export function getExcelQAStats() {
  return {
    totalItems: excelQADatabase.length,
    categories: [...new Set(excelQADatabase.map(item => item.category))],
    recentItems: excelQADatabase.slice(-5).map(item => ({
      id: item.id,
      question: item.question.substring(0, 50) + '...',
      category: item.category,
      createdAt: item.createdAt
    }))
  }
}