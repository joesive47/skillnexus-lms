import { getQuizzes, deleteQuiz } from '@/app/actions/quiz'
import { ExcelImportForm } from '@/components/quiz/excel-import-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default async function AdminQuizzesPage() {
  const result = await getQuizzes()
  
  if (!result.success) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-red-500">Failed to load quizzes</p>
      </div>
    )
  }
  
  const quizzes = result.quizzes!

  async function handleDelete(quizId: string) {
    'use server'
    await deleteQuiz(quizId)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quiz Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ExcelImportForm />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <p className="text-muted-foreground">No quizzes found. Import your first quiz!</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead># Questions</TableHead>
                      <TableHead># Submissions</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{quiz._count.questions}</TableCell>
                        <TableCell>{quiz._count.submissions}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/dashboard/admin/quizzes/${quiz.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link href={`/dashboard/admin/quizzes/${quiz.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <form action={handleDelete.bind(null, quiz.id)}>
                              <Button variant="destructive" size="sm" type="submit">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}