// Fuzzy matching และ semantic similarity สำหรับ chatbot
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

export function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 1
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase())
  return (maxLength - distance) / maxLength
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s]/g, '') // เก็บเฉพาะไทย อังกฤษ ตัวเลข
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractKeywords(text: string): string[] {
  const normalized = normalizeText(text)
  const words = normalized.split(' ').filter(word => word.length > 1)
  
  // Remove common Thai and English stop words
  const stopWords = [
    'ที่', 'เป็น', 'ใน', 'ของ', 'และ', 'หรือ', 'กับ', 'จาก', 'ไป', 'มา', 'ได้', 'แล้ว', 'ครับ', 'ค่ะ', 'คือ',
    'อะไร', 'ไหม', 'บ้าง', 'นะ', 'ครับ', 'ค่ะ', 'นี้', 'นั้น', 'นี่', 'นั่น', 'อย่างไร', 'ทำไม', 'เมื่อไหร่',
    'the', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'what', 'how', 'when'
  ]
  return words.filter(word => !stopWords.includes(word))
}

// เพิ่มฟังก์ชันสำหรับจับคู่คำสำคัญ
export function matchKeywords(query: string, text: string): number {
  const queryWords = extractKeywords(query)
  const textWords = extractKeywords(text)
  
  if (queryWords.length === 0) return 0
  
  let matches = 0
  for (const queryWord of queryWords) {
    for (const textWord of textWords) {
      if (textWord.includes(queryWord) || queryWord.includes(textWord) || calculateSimilarity(queryWord, textWord) > 0.8) {
        matches++
        break
      }
    }
  }
  
  return matches / queryWords.length
}

export function calculateKeywordSimilarity(query: string, target: string): number {
  const queryKeywords = extractKeywords(query)
  const targetKeywords = extractKeywords(target)
  
  if (queryKeywords.length === 0 || targetKeywords.length === 0) return 0
  
  let matches = 0
  for (const qWord of queryKeywords) {
    for (const tWord of targetKeywords) {
      if (calculateSimilarity(qWord, tWord) > 0.7) {
        matches++
        break
      }
    }
  }
  
  return matches / Math.max(queryKeywords.length, targetKeywords.length)
}

export function findBestMatch(query: string, candidates: Array<{question: string, answer: string}>): {match: any, score: number} | null {
  let bestMatch = null
  let bestScore = 0
  
  for (const candidate of candidates) {
    // คำนวณคะแนนจากหลายวิธี
    const exactSimilarity = calculateSimilarity(query, candidate.question)
    const keywordSimilarity = calculateKeywordSimilarity(query, candidate.question)
    
    // รวมคะแนน (ให้น้ำหนัก keyword มากกว่า)
    const combinedScore = (exactSimilarity * 0.3) + (keywordSimilarity * 0.7)
    
    if (combinedScore > bestScore && combinedScore > 0.3) { // threshold 30%
      bestScore = combinedScore
      bestMatch = candidate
    }
  }
  
  return bestMatch ? { match: bestMatch, score: bestScore } : null
}