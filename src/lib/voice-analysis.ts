// Voice Analysis Utilities

export interface FreeAnalysisResult {
  wordCount: number
  duration: number
  accuracy: number
  keywordsFound: string[]
  keywordsMissing: string[]
  feedback: string
  score: number
}

export interface PremiumAnalysisResult {
  wordCount: number
  duration: number
  accuracy: number
  grammar: {
    score: number
    issues: string[]
  }
  vocabulary: {
    score: number
    level: string
    suggestions: string[]
  }
  fluency: {
    score: number
    wordsPerMinute: number
    pauseCount: number
  }
  feedback: string
  score: number
}

// FREE Mode Analysis
export function analyzeSpeechFree(
  transcription: string,
  targetText: string | null,
  keywords: string[] | null,
  duration: number
): FreeAnalysisResult {
  const words = transcription.trim().split(/\s+/)
  const wordCount = words.length

  let accuracy = 100
  let keywordsFound: string[] = []
  let keywordsMissing: string[] = []

  // Check keywords if provided
  if (keywords && keywords.length > 0) {
    const transcriptionLower = transcription.toLowerCase()
    keywords.forEach(keyword => {
      if (transcriptionLower.includes(keyword.toLowerCase())) {
        keywordsFound.push(keyword)
      } else {
        keywordsMissing.push(keyword)
      }
    })
    accuracy = (keywordsFound.length / keywords.length) * 100
  }

  // Compare with target text if provided
  if (targetText) {
    const similarity = calculateSimilarity(transcription, targetText)
    accuracy = similarity
  }

  // Generate feedback
  const feedback = generateFreeFeedback(wordCount, duration, accuracy, keywordsMissing)
  const score = Math.round(accuracy)

  return {
    wordCount,
    duration,
    accuracy: Math.round(accuracy),
    keywordsFound,
    keywordsMissing,
    feedback,
    score
  }
}

function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)
  
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return (intersection.size / union.size) * 100
}

function generateFreeFeedback(
  wordCount: number,
  duration: number,
  accuracy: number,
  keywordsMissing: string[]
): string {
  let feedback = `คุณพูดได้ ${wordCount} คำใน ${duration} วินาที `
  
  if (accuracy >= 90) {
    feedback += `ความถูกต้อง ${accuracy.toFixed(0)}% ยอดเยี่ยม! 🎉`
  } else if (accuracy >= 70) {
    feedback += `ความถูกต้อง ${accuracy.toFixed(0)}% ดีมาก แต่ยังมีที่ปรับปรุงได้`
  } else {
    feedback += `ความถูกต้อง ${accuracy.toFixed(0)}% ควรฝึกฝนเพิ่มเติม`
  }

  if (keywordsMissing.length > 0) {
    feedback += `\n\n⚠️ คำสำคัญที่ยังขาด: ${keywordsMissing.join(', ')}`
  }

  return feedback
}

// PREMIUM Mode Analysis (using OpenAI)
export async function analyzeSpeechPremium(
  transcription: string,
  targetText: string | null,
  instruction: string
): Promise<PremiumAnalysisResult> {
  const openaiApiKey = process.env.OPENAI_API_KEY

  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const prompt = `วิเคราะห์การพูดภาษาไทย/อังกฤษต่อไปนี้:

คำแนะนำ: ${instruction}
${targetText ? `ข้อความเป้าหมาย: ${targetText}` : ''}

ข้อความที่พูด: ${transcription}

กรุณาวิเคราะห์และให้คะแนนในด้านต่อไปนี้:
1. Grammar (ไวยากรณ์) - คะแนน 0-100 และระบุข้อผิดพลาด
2. Vocabulary (คำศัพท์) - คะแนน 0-100, ระดับ (A1-C2), และคำแนะนำ
3. Fluency (ความคล่องแคล่ว) - คะแนน 0-100, คำต่อนาที, จำนวนการหยุด

ตอบกลับในรูปแบบ JSON:
{
  "grammar": {"score": 85, "issues": ["..."]},
  "vocabulary": {"score": 90, "level": "B2", "suggestions": ["..."]},
  "fluency": {"score": 88, "wordsPerMinute": 120, "pauseCount": 3},
  "feedback": "คำแนะนำโดยละเอียด..."
}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'คุณเป็นผู้เชี่ยวชาญด้านการสอนภาษาและการวิเคราะห์การพูด' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    throw new Error('Failed to analyze with OpenAI')
  }

  const data = await response.json()
  const analysis = JSON.parse(data.choices[0].message.content)

  const words = transcription.trim().split(/\s+/)
  const wordCount = words.length
  const duration = Math.round((wordCount / analysis.fluency.wordsPerMinute) * 60)

  const overallScore = Math.round(
    (analysis.grammar.score + analysis.vocabulary.score + analysis.fluency.score) / 3
  )

  return {
    wordCount,
    duration,
    accuracy: overallScore,
    grammar: analysis.grammar,
    vocabulary: analysis.vocabulary,
    fluency: analysis.fluency,
    feedback: analysis.feedback,
    score: overallScore
  }
}

// Transcribe audio using OpenAI Whisper
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY

  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const formData = new FormData()
  const uint8Array = new Uint8Array(audioBuffer)
  formData.append('file', new Blob([uint8Array]), 'audio.webm')
  formData.append('model', 'whisper-1')
  formData.append('language', 'th')

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to transcribe audio')
  }

  const data = await response.json()
  return data.text
}
