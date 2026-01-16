import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const careerId = searchParams.get('careerId')
    
    if (!careerId) {
      return NextResponse.json({ error: 'Career ID required' }, { status: 400 })
    }

    await prisma.$connect()
    
    const deleted = await prisma.assessmentQuestion.deleteMany({
      where: { careerId }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: `ลบคำถาม ${deleted.count} ข้อเรียบร้อย`,
      count: deleted.count 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
