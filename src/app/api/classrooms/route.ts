import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireAdmin, requireUser } from '@/lib/access-control'

export async function GET() {
  try {
    await requireUser()
    const classrooms = await prisma.classroom.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(classrooms)
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const { name, description, courseId } = await request.json()
    
    const classroom = await prisma.classroom.create({
      data: {
        name,
        description,
        courseId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    })
    
    return NextResponse.json(classroom)
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}
