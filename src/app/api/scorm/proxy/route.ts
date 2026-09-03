import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Store active tokens in memory (use Redis in production)
const activeTokens = new Map<string, { userId: string; lessonId: string; expiresAt: number }>()

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId } = await req.json()

    // Verify user has access to this lesson
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        course: {
          lessons: {
            some: { id: lessonId }
          }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Generate temporary token (valid for 2 hours)
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000

    activeTokens.set(token, {
      userId: session.user.id,
      lessonId,
      expiresAt
    })

    // Clean up expired tokens
    for (const [key, value] of activeTokens.entries()) {
      if (value.expiresAt < Date.now()) {
        activeTokens.delete(key)
      }
    }

    return NextResponse.json({ token, expiresAt })
  } catch (error) {
    console.error('Token generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    const path = req.nextUrl.searchParams.get('path')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 })
    }

    const tokenData = activeTokens.get(token)
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      activeTokens.delete(token)
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Get lesson with SCORM URL
    const lesson = await prisma.lesson.findUnique({
      where: { id: tokenData.lessonId },
      select: { youtubeUrl: true }
    })

    if (!lesson?.youtubeUrl) {
      return NextResponse.json({ error: 'SCORM not found' }, { status: 404 })
    }

    // Proxy the SCORM content
    const scormUrl = `${lesson.youtubeUrl}${path || ''}`
    const response = await fetch(scormUrl)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'SCORM fetch failed' }, { status: response.status })
    }

    const content = await response.text()
    const contentType = response.headers.get('content-type') || 'text/html'

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "frame-ancestors 'self'",
        'Cache-Control': 'private, no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('SCORM proxy error:', error)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}
