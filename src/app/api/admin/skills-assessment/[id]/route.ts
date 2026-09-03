import { adminAccessDenied } from '@/lib/access-control'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  try {
    const { id } = await params
    // Get assessments from main API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/skills-assessment`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
    }
    
    const payload: unknown = await response.json()
    if (!Array.isArray(payload)) {
      return NextResponse.json({ error: 'Invalid assessment response' }, { status: 502 })
    }
    const adminAssessments = payload as Array<{ id: string; enabled?: boolean; [key: string]: unknown }>
    const assessment = adminAssessments.find(a => a.id === id)
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }
    
    if (!assessment.enabled) {
      return NextResponse.json({ error: 'Assessment is disabled' }, { status: 403 })
    }
    
    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Get assessment by ID error:', error)
    return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 })
  }
}
