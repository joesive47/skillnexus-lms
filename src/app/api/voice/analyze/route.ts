import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { analyzeSpeechFree, analyzeSpeechPremium, transcribeAudio } from '@/lib/voice-analysis'

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
    const attempt = parseInt(formData.get('attempt') as string)

    if (!assignmentId || !audioFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const assignment = await prisma.voiceAssignment.findUnique({
      where: { id: assignmentId }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    if (aiMode === 'PREMIUM') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
      })

      if (!user || user.credits < 5) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
      }
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    const duration = Math.round(audioFile.size / 16000)

    let transcription: string
    let analysis: any
    let score: number
    let feedback: string
    let creditsUsed = 0

    if (aiMode === 'FREE') {
      transcription = formData.get('transcription') as string
      
      const keywords = assignment.keywords ? JSON.parse(assignment.keywords) : null
      const result = analyzeSpeechFree(
        transcription,
        assignment.targetText,
        keywords,
        duration
      )

      analysis = result
      score = result.score
      feedback = result.feedback

    } else {
      transcription = await transcribeAudio(audioBuffer)
      
      const result = await analyzeSpeechPremium(
        transcription,
        assignment.targetText,
        assignment.instruction
      )

      analysis = result
      score = result.score
      feedback = result.feedback
      creditsUsed = 5

      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 5 } }
      })
    }

    const audioUrl = `/uploads/voice/${Date.now()}-${audioFile.name}`

    const submission = await prisma.voiceSubmission.create({
      data: {
        assignmentId,
        studentId: session.user.id,
        audioUrl,
        duration,
        transcription,
        analysis: JSON.stringify(analysis),
        score,
        feedback,
        attempt,
        status: score >= assignment.passingScore ? 'PASS' : 'FAIL',
        aiMode,
        creditsUsed
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
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
