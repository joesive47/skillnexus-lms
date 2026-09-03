import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { templateId } = await request.json()

    if (!templateId || ![1, 2, 3].includes(templateId)) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 })
    }

    // Save user's template preference
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        certificateTemplate: templateId
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Template saved successfully',
      templateId 
    })

  } catch (error) {
    console.error('Error saving template:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { certificateTemplate: true }
    })

    return NextResponse.json({ 
      templateId: user?.certificateTemplate || null 
    })

  } catch (error) {
    console.error('Error getting template:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}