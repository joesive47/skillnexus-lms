import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { careerNodes, careerEdges } from '@/lib/career/career-data'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        careers: careerNodes,
        paths: careerEdges,
        totalCareers: careerNodes.length,
        totalPaths: careerEdges.length
      }
    })
  } catch (error) {
    console.error('Error fetching careers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch careers' },
      { status: 500 }
    )
  }
}