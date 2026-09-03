import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats = {
      totalUsers: 1247,
      activeCareerPaths: 892,
      completedAssessments: 2341,
      avgSuccessRate: 78,
      popularPaths: [
        { from: 'Junior Developer', to: 'Senior Developer', count: 342 },
        { from: 'Data Analyst', to: 'Data Scientist', count: 289 },
        { from: 'Marketing Coordinator', to: 'Digital Marketing Manager', count: 234 }
      ],
      topSkills: [
        { name: 'JavaScript', demand: 95 },
        { name: 'Python', demand: 92 },
        { name: 'React', demand: 88 },
        { name: 'Machine Learning', demand: 85 },
        { name: 'AWS', demand: 82 }
      ]
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching career stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch career stats' },
      { status: 500 }
    )
  }
}