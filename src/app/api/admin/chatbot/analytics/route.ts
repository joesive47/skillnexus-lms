import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    totalQuestions: 2,
    activeQuestions: 2,
    totalInteractions: 0,
    averageResponseTime: 0
  })
}