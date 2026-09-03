import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })
    
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }
    
    return NextResponse.json(classroom)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classroom' }, { status: 500 })
  }
}