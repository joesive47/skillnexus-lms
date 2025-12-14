import { NextRequest, NextResponse } from 'next/server'
import { RiskAssessmentEngine } from '@/lib/risk-assessment'

const riskEngine = new RiskAssessmentEngine()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const assessment = await riskEngine.calculateRiskScore(userId)
    
    return NextResponse.json({
      success: true,
      data: assessment
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Risk assessment failed' },
      { status: 500 }
    )
  }
}