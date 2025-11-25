import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'all'

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results: any = {
      courses: [],
      lessons: [],
      quizzes: []
    }

    if (type === 'all' || type === 'courses') {
      results.courses = await prisma.course.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ]
        },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          price: true,
          _count: { select: { lessons: true, enrollments: true } }
        },
        take: 10
      })
    }

    if (type === 'all' || type === 'lessons') {
      results.lessons = await prisma.lesson.findMany({
        where: {
          course: { published: true },
          OR: [
            { title: { contains: query } },
            { content: { contains: query } }
          ]
        },
        select: {
          id: true,
          title: true,
          type: true,
          courseId: true,
          course: { select: { title: true } }
        },
        take: 10
      })
    }

    if (type === 'all' || type === 'quizzes') {
      results.quizzes = await prisma.quiz.findMany({
        where: {
          course: { published: true },
          title: { contains: query }
        },
        select: {
          id: true,
          title: true,
          courseId: true,
          course: { select: { title: true } },
          _count: { select: { questions: true } }
        },
        take: 10
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}