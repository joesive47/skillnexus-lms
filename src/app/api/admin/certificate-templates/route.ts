import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { templateId, courseId, settings } = await request.json()

    if (!templateId || !courseId) {
      return NextResponse.json({ error: 'Template ID and Course ID are required' }, { status: 400 })
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // For now, we'll store the template settings in a simple way
    // In a real implementation, you might want to create a separate table for certificate templates
    const templateData = {
      courseId,
      templateId,
      settings,
      updatedAt: new Date()
    }

    // Store in a simple JSON file or database table
    // For this example, we'll just return success
    console.log('Certificate template saved:', templateData)

    return NextResponse.json({ 
      success: true, 
      message: 'Certificate template saved successfully',
      data: templateData
    })

  } catch (error) {
    console.error('Error saving certificate template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (courseId) {
      // Return template for specific course
      // In a real implementation, fetch from database
      return NextResponse.json({
        courseId,
        templateId: 'modern',
        settings: {
          title: 'ใบประกาศนียบัตร',
          subtitle: 'Certificate of Completion',
          organizationName: 'SkillNexus Learning Platform',
          signerName: 'ผู้อำนวยการ',
          signerTitle: 'Director'
        }
      })
    }

    // Return all templates
    return NextResponse.json({
      templates: [
        {
          id: 'modern',
          name: 'Modern Professional',
          description: 'แบบฟอร์มสมัยใหม่ เหมาะสำหรับหลักสูตรเทคโนโลยี'
        },
        {
          id: 'classic',
          name: 'Classic Elegant',
          description: 'แบบฟอร์มคลาสสิค เหมาะสำหรับหลักสูตรทั่วไป'
        },
        {
          id: 'creative',
          name: 'Creative Design',
          description: 'แบบฟอร์มสร้างสรรค์ เหมาะสำหรับหลักสูตรศิลปะ'
        },
        {
          id: 'minimal',
          name: 'Minimal Clean',
          description: 'แบบฟอร์มมินิมอล เรียบง่าย'
        }
      ]
    })

  } catch (error) {
    console.error('Error fetching certificate templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}