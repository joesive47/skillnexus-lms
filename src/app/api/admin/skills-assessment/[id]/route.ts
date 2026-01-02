import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get assessments from main API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/skills-assessment`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
    }
    
    const adminAssessments = await response.json()
    const assessment = adminAssessments.find((a: any) => a.id === params.id)
    
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