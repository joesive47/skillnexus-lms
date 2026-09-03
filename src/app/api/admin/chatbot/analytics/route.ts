import { adminAccessDenied } from '@/lib/access-control'
import { NextResponse } from 'next/server'

export async function GET() {
  const denied = await adminAccessDenied()
  if (denied) return denied

  return NextResponse.json({
    totalQuestions: 2,
    activeQuestions: 2,
    totalInteractions: 0,
    averageResponseTime: 0
  })
}