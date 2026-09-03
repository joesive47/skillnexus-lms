'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2 } from 'lucide-react'
import { getCareerWithQuestions, updateCareer, updateQuestion, deleteQuestion } from '@/app/actions/assessment'
import { toast } from 'sonner'

interface Career {
  id: string
  title: string
  description: string | null
  category: string | null
}

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

interface EditCareerDialogProps {
  career: Career
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditCareerDialog({ career, open, onOpenChange, onSuccess }: EditCareerDialogProps) {
  const [formData, setFormData] = useState({
    title: career.title,
    description: career.description ?? '',
    category: career.category ?? ''
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadQuestions()
    }
  }, [open, career.id])

  const loadQuestions = async () => {
    const data = await getCareerWithQuestions(career.id)
    if (data) {
      setQuestions(data.questions)
    }
  }

  const handleSaveCareer = async () => {
    setLoading(true)
    const result = await updateCareer(career.id, formData)
    if (result.success) {
      toast.success('บันทึกสำเร็จ')
      onSuccess()
      onOpenChange(false)
    } else {
      toast.error('ไม่สามารถบันทึกได้')
    }
    setLoading(false)
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('ต้องการลบคำถามนี้หรือไม่?')) return
    
    const result = await deleteQuestion(questionId)
    if (result.success) {
      toast.success('ลบคำถามสำเร็จ')
      loadQuestions()
    } else {
      toast.error('ไม่สามารถลบได้')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>แก้ไขการประเมิน: {career.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Career Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ข้อมูลการประเมิน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">ชื่อการประเมิน</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">หมวดหมู่</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <Button onClick={handleSaveCareer} disabled={loading}>
                {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </Button>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">คำถาม ({questions.length})</CardTitle>
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
                          คะแนน: {question.score}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingQuestion(question)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-medium mb-2">{question.questionText}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className={question.correctAnswer.includes('1') ? 'text-green-600 font-medium' : ''}>
                        1. {question.option1}
                      </div>
                      <div className={question.correctAnswer.includes('2') ? 'text-green-600 font-medium' : ''}>
                        2. {question.option2}
                      </div>
                      <div className={question.correctAnswer.includes('3') ? 'text-green-600 font-medium' : ''}>
                        3. {question.option3}
                      </div>
                      <div className={question.correctAnswer.includes('4') ? 'text-green-600 font-medium' : ''}>
                        4. {question.option4}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {editingQuestion && (
          <EditQuestionDialog
            question={editingQuestion}
            open={!!editingQuestion}
            onOpenChange={(open) => !open && setEditingQuestion(null)}
            onSuccess={loadQuestions}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function EditQuestionDialog({ 
  question, 
  open, 
  onOpenChange, 
  onSuccess 
}: {
  question: Question
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    questionText: question.questionText,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    correctAnswer: question.correctAnswer,
    score: question.score
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const result = await updateQuestion(question.id, formData)
    if (result.success) {
      toast.success('บันทึกคำถามสำเร็จ')
      onSuccess()
      onOpenChange(false)
    } else {
      toast.error('ไม่สามารถบันทึกได้')
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>แก้ไขคำถาม</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>คำถาม</Label>
            <Textarea
              value={formData.questionText}
              onChange={(e) => setFormData(prev => ({ ...prev, questionText: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ตัวเลือก 1</Label>
              <Input
                value={formData.option1}
                onChange={(e) => setFormData(prev => ({ ...prev, option1: e.target.value }))}
              />
            </div>
            <div>
              <Label>ตัวเลือก 2</Label>
              <Input
                value={formData.option2}
                onChange={(e) => setFormData(prev => ({ ...prev, option2: e.target.value }))}
              />
            </div>
            <div>
              <Label>ตัวเลือก 3</Label>
              <Input
                value={formData.option3}
                onChange={(e) => setFormData(prev => ({ ...prev, option3: e.target.value }))}
              />
            </div>
            <div>
              <Label>ตัวเลือก 4</Label>
              <Input
                value={formData.option4}
                onChange={(e) => setFormData(prev => ({ ...prev, option4: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>คำตอบที่ถูก (1,2,3,4)</Label>
              <Input
                value={formData.correctAnswer}
                onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                placeholder="เช่น 1 หรือ 1,3"
              />
            </div>
            <div>
              <Label>คะแนน</Label>
              <Input
                type="number"
                value={formData.score}
                onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              ยกเลิก
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}