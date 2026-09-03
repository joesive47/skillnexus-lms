import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { analyzeSpeechFree, analyzeSpeechPremium, transcribeAudio } from '@/lib/voice-analysis'
import { AccessError, publicError, requireLessonAccess } from '@/lib/access-control'

const PREMIUM_CREDIT_COST = 5
const MAX_AUDIO_BYTES = 15 * 1024 * 1024
const ALLOWED_AUDIO_TYPES = new Set(['audio/webm', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp4'])

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const assignmentId = formData.get('assignmentId') as string
    const audioFile = formData.get('audio') as File
    const aiMode = formData.get('aiMode') as string

    if (!assignmentId || !(audioFile instanceof File)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (audioFile.size <= 0 || audioFile.size > MAX_AUDIO_BYTES || !ALLOWED_AUDIO_TYPES.has(audioFile.type)) {
      return NextResponse.json({ error: 'Unsupported audio file or file too large' }, { status: 413 })
    }

    if (!['FREE', 'PREMIUM'].includes(aiMode)) {
      return NextResponse.json({ error: 'Invalid analysis mode' }, { status: 400 })
    }

    const assignment = await prisma.voiceAssignment.findUnique({
      where: { id: assignmentId }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    await requireLessonAccess(session.user.id, assignment.lessonId)

    const providedTranscription = formData.get('transcription')
    if (aiMode === 'FREE' && (typeof providedTranscription !== 'string' || !providedTranscription.trim() || providedTranscription.length > 20000)) {
      return NextResponse.json({ error: 'Invalid transcription' }, { status: 400 })
    }

    // Serialize attempt allocation and reserve billable credits in one transaction.
    const reservation = await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM users WHERE id = ${session.user.id} FOR UPDATE`
      const previousAttempts = await tx.voiceSubmission.count({ where: { assignmentId, studentId: session.user.id } })
      if (previousAttempts >= assignment.maxAttempts) throw new AccessError('Maximum attempts reached', 409)
      const creditsUsed = aiMode === 'PREMIUM' ? PREMIUM_CREDIT_COST : 0
      if (creditsUsed) {
        const reserved = await tx.user.updateMany({
          where: { id: session.user.id, credits: { gte: creditsUsed } },
          data: { credits: { decrement: creditsUsed } }
        })
        if (reserved.count !== 1) throw new AccessError('Insufficient credits', 402)
      }
      return tx.voiceSubmission.create({
        data: {
          assignmentId,
          studentId: session.user.id,
          audioUrl: 'not-stored',
          duration: 0,
          transcription: '',
          analysis: null,
          score: 0,
          feedback: 'Processing',
          attempt: previousAttempts + 1,
          status: 'PROCESSING',
          aiMode,
          creditsUsed
        }
      })
    })

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    const duration = Math.round(audioFile.size / 16000)

    let transcription: string
    let analysis: unknown
    let score: number
    let feedback: string
    const creditsUsed = reservation.creditsUsed

    try {
      if (aiMode === 'FREE') {
        transcription = providedTranscription as string
        const keywords = assignment.keywords ? JSON.parse(assignment.keywords) : null
        const result = analyzeSpeechFree(transcription, assignment.targetText, keywords, duration)
        analysis = result
        score = result.score
        feedback = result.feedback
      } else {
        transcription = await transcribeAudio(audioBuffer)
        const result = await analyzeSpeechPremium(transcription, assignment.targetText, assignment.instruction)
        analysis = result
        score = result.score
        feedback = result.feedback
      }
    } catch (analysisError) {
      await prisma.$transaction(async tx => {
        await tx.voiceSubmission.delete({ where: { id: reservation.id } })
        if (creditsUsed) await tx.user.update({
          where: { id: session.user.id }, data: { credits: { increment: creditsUsed } }
        })
      })
      throw analysisError
    }

    const submission = await prisma.voiceSubmission.update({
      where: { id: reservation.id },
      data: {
        duration,
        transcription,
        analysis: JSON.stringify(analysis),
        score,
        feedback,
        status: score >= assignment.passingScore ? 'PASS' : 'FAIL',
      }
    })

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        score,
        feedback,
        status: submission.status,
        transcription,
        analysis,
        creditsUsed
      }
    })

  } catch (error) {
    console.error('Voice analysis error:', error)
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
