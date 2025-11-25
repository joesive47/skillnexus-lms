import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, price, description, published, imageUrl, lessons } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        price: price || 0,
        description,
        published: published || false,
        imageUrl,
      }
    })

    // Create lessons separately with courseId
    if (lessons && lessons.length > 0) {
      await prisma.lesson.createMany({
        data: lessons.map((lesson: any, index: number) => ({
          courseId: course.id,
          lessonType: lesson.type,
          order: lesson.order || index + 1,
          title: lesson.title,
          youtubeUrl: lesson.youtubeUrl,
          requiredCompletionPercentage: lesson.requiredPct || 80,
          duration: lesson.durationMin ? lesson.durationMin * 60 : null, // Convert to seconds
          quizId: lesson.quizId || null,
        }))
      })
    }

    // Fetch course with lessons
    const courseWithLessons = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ course: courseWithLessons })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, price, description, published, imageUrl, lessons } = body

    if (!id || !title) {
      return NextResponse.json({ error: 'ID and title are required' }, { status: 400 })
    }

    // Update course
    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        price: price || 0,
        description,
        published: published || false,
        imageUrl,
      }
    })

    // Delete existing lessons and create new ones
    await prisma.lesson.deleteMany({
      where: { courseId: id }
    })

    if (lessons && lessons.length > 0) {
      await prisma.lesson.createMany({
        data: lessons.map((lesson: any, index: number) => ({
          courseId: course.id,
          lessonType: lesson.type,
          order: lesson.order || index + 1,
          title: lesson.title,
          youtubeUrl: lesson.youtubeUrl,
          requiredCompletionPercentage: lesson.requiredPct || 80,
          duration: lesson.durationMin ? lesson.durationMin * 60 : null,
          quizId: lesson.quizId || null,
        }))
      })
    }

    // Fetch updated course with lessons
    const courseWithLessons = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ course: courseWithLessons })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}