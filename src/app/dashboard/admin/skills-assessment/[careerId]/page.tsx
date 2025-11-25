'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react'
import { getCareerWithQuestions, deleteQuestion } from '@/app/actions/assessment'
import { toast } from 'sonner'
import { EditQuestionDialog } from '@/components/admin/edit-question-dialog'

interface Question {
  id: string
  questionId: string
  questionText: string
  option1: string
  option2: string
  option3: string
  option4: string
  correctAnswer: string
  score: number
  skill: { name: string }
}

interface Career {
  id: string
  title: string
  description: string | null
  category: string | null
}

export default function CareerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const careerId = params.careerId as string
  
  const [career, setCareer] = useState<Career | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  useEffect(() => {
    loadData()
  }, [careerId])

  const loadData = async () => {
    try {
      const data = await getCareerWithQuestions(careerId)
      if (data) {
        setCareer(data.career)
        setQuestions(data.questions)
      }
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuestion = async (questionId: string, questionText: string) => {
    if (!confirm(`ต้องการลบคำถาม "${questionText.substring(0, 50)}..." หรือไม่?`)) return
    
    const result = await deleteQuestion(questionId)
    if (result.success) {
      toast.success('ลบคำถามสำเร็จ')
      loadData()
    } else {
      toast.error('ไม่สามารถลบได้')
    }
  }

  const getSkillStats = () => {
    const skillCounts = questions.reduce((acc, q) => {
      acc[q.skill.name] = (acc[q.skill.name] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(skillCounts).map(([skill, count]) => ({ skill, count }))
  }

  if (loading) {
    return <div className="flex justify-center p-8">กำลังโหลด...</div>
  }

  if (!career) {
    return <div className="text-center p-8">ไม่พบข้อมูลการประเมิน</div>
  }

  const skillStats = getSkillStats()
  const totalScore = questions.reduce((sum, q) => sum + q.score, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{career.title}</h1>
          {career.description && (
            <p className="text-gray-600">{career.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{questions.length}</div>
            <div className="text-sm text-gray-600">คำถามทั้งหมด</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{skillStats.length}</div>
            <div className="text-sm text-gray-600">ทักษะที่ประเมิน</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalScore}</div>
            <div className="text-sm text-gray-600">คะแนนรวม</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">~{Math.ceil(questions.length * 2)}</div>
            <div className="text-sm text-gray-600">นาที (ประมาณ)</div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>การกระจายทักษะ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skillStats.map(({ skill, count }) => (
              <Badge key={skill} variant="outline" className="text-sm">
                {skill} ({count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>คำถาม</CardTitle>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              เพิ่มคำถาม
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <Badge>{question.skill.name}</Badge>
                    <span className="text-sm text-gray-500">
                      ID: {question.questionId}
                    </span>
                    <span className="text-sm text-gray-500">
                      คะแนน: {question.score}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(question)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id, question.questionText)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="font-medium mb-3">{question.questionText}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className={`p-2 rounded ${question.correctAnswer.includes('1') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50'}`}>
                    <span className="font-medium">1.</span> {question.option1}
                  </div>
                  <div className={`p-2 rounded ${question.correctAnswer.includes('2') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50'}`}>
                    <span className="font-medium">2.</span> {question.option2}
                  </div>
                  <div className={`p-2 rounded ${question.correctAnswer.includes('3') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50'}`}>
                    <span className="font-medium">3.</span> {question.option3}
                  </div>
                  <div className={`p-2 rounded ${question.correctAnswer.includes('4') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50'}`}>
                    <span className="font-medium">4.</span> {question.option4}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  คำตอบที่ถูก: {question.correctAnswer}
                </div>
              </div>
            ))}
          </div>
          
          {questions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีคำถามในการประเมินนี้
            </div>
          )}
        </CardContent>
      </Card>

      {editingQuestion && (
        <EditQuestionDialog
          question={editingQuestion}
          open={!!editingQuestion}
          onOpenChange={(open) => !open && setEditingQuestion(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}