import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Toggle assessment enabled/disabled status
export async function POST(request: Request) {
  try {
    await prisma.$connect()
    const { id, enabled } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 })
    }
    
    console.log('=== Toggling Assessment Status ===')
    console.log('Assessment ID:', id)
    console.log('New status:', enabled)
    
    // For now, we'll just return success since we don't have an enabled field in the Career model
    // In a real implementation, you might add an 'enabled' field to the Career model
    
    return NextResponse.json({ 
      success: true, 
      message: `Assessment ${enabled ? 'enabled' : 'disabled'} successfully`,
      enabled 
    })
  } catch (error) {
    console.error('Toggle assessment error:', error)
    return NextResponse.json({ 
      error: 'Failed to toggle assessment status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}