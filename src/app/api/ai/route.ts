import { NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: Request) {
  const { message, context } = await request.json()
  
  const response = await AIService.getChatResponse(message, context)
  
  return NextResponse.json({ response })
}