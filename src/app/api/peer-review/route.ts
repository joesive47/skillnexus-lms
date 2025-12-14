import { NextRequest, NextResponse } from 'next/server'
import { PeerReviewSystem } from '@/lib/peer-review'

const peerReviewSystem = new PeerReviewSystem()

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()
    
    switch (action) {
      case 'create_project':
        const projectId = await peerReviewSystem.createProject(data)
        return NextResponse.json({ success: true, projectId })
        
      case 'submit_review':
        await peerReviewSystem.submitPeerReview(data)
        return NextResponse.json({ success: true })
        
      case 'generate_portfolio':
        const portfolio = await peerReviewSystem.generateSkillPortfolio(data.userId)
        return NextResponse.json({ success: true, portfolio })
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 })
  }
}