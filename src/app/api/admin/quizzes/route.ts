import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }
}