import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { VoicePractice } from '@/components/voice/voice-practice'

export default async function VoicePracticePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const { id } = await params
  const assignment = await prisma.voiceAssignment.findFirst({
    where: { lessonId: id }
  })

  if (!assignment) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบแบบฝึกหัด Voice Practice</h1>
          <p className="text-muted-foreground">บทเรียนนี้ยังไม่มีแบบฝึกหัด Voice Practice</p>
        </div>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true }
  })

  const submissions = await prisma.voiceSubmission.findMany({
    where: {
      assignmentId: assignment.id,
      studentId: session.user.id
    },
    orderBy: { createdAt: 'desc' }
  })

  const currentAttempt = submissions.length + 1

  return (
    <div className="container mx-auto py-8">
      <VoicePractice
        assignment={{
          id: assignment.id,
          title: assignment.title,
          instruction: assignment.instruction,
          targetText: assignment.targetText || undefined,
          keywords: assignment.keywords ? JSON.parse(assignment.keywords) : undefined,
          minWords: assignment.minWords,
          maxDuration: assignment.maxDuration,
          passingScore: assignment.passingScore,
          maxAttempts: assignment.maxAttempts
        }}
        userCredits={user?.credits || 0}
        currentAttempt={currentAttempt}
      />
    </div>
  )
}
