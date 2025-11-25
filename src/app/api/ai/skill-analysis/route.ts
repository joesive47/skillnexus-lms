import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { skillGapAnalyzer } from '@/lib/skill-gap-analyzer'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { careerId } = await request.json()

    const analysis = await skillGapAnalyzer.analyzeUserSkillGaps(
      session.user.id,
      careerId
    )

    const recommendations = await skillGapAnalyzer.recommendLearningPath(
      session.user.id,
      analysis.skillGaps
    )

    return NextResponse.json({
      analysis,
      recommendations,
      skillTrends: await skillGapAnalyzer.getSkillTrends()
    })

  } catch (error) {
    console.error('Error analyzing skills:', error)
    return NextResponse.json(
      { error: 'Failed to analyze skills' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const careerId = searchParams.get('careerId')

    const analysis = await skillGapAnalyzer.analyzeUserSkillGaps(
      session.user.id,
      careerId || undefined
    )

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Error fetching skill analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skill analysis' },
      { status: 500 }
    )
  }
}