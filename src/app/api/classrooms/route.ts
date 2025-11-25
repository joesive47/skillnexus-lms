import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
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
    return NextResponse.json({ error: 'Failed to fetch classrooms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json({ error: 'Failed to create classroom' }, { status: 500 })
  }
}