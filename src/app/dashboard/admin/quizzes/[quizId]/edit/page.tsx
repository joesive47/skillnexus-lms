import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateQuizMetadata } from '@/app/actions/quiz'

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: true
        }
      }
    }
  })

  if (!quiz) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-red-500">Quiz not found</p>
      </div>
    )
  }

  async function handleUpdateTitle(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    await updateQuizMetadata(quizId, title)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/dashboard/admin/quizzes/${quiz.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Quiz</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleUpdateTitle} className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={quiz.title}
                required
              />
            </div>
            <Button type="submit">Update Title</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions ({quiz.questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Question editing is currently not supported. Please re-import the quiz with updated Excel file.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}