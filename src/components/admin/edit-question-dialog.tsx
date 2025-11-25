'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { updateQuestion } from '@/app/actions/assessment'
import { toast } from 'sonner'

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

interface EditQuestionDialogProps {
  question: Question
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditQuestionDialog({ question, open, onOpenChange, onSuccess }: EditQuestionDialogProps) {
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
    if (!formData.questionText.trim()) {
      toast.error('กรุณากรอกคำถาม')
      return
    }

    if (!formData.option1.trim() || !formData.option2.trim() || !formData.option3.trim() || !formData.option4.trim()) {
      toast.error('กรุณากรอกตัวเลือกให้ครบ')
      return
    }

    if (!formData.correctAnswer.trim()) {
      toast.error('กรุณาระบุคำตอบที่ถูก')
      return
    }

    setLoading(true)
    try {
      const result = await updateQuestion(question.id, formData)
      if (result.success) {
        toast.success('บันทึกคำถามสำเร็จ')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error('ไม่สามารถบันทึกได้')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>แก้ไขคำถาม - {question.skill.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            ID: {question.questionId}
          </div>
          
          <div>
            <Label htmlFor="questionText">คำถาม *</Label>
            <Textarea
              id="questionText"
              value={formData.questionText}
              onChange={(e) => setFormData(prev => ({ ...prev, questionText: e.target.value }))}
              rows={3}
              placeholder="กรอกคำถาม..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="option1">ตัวเลือก 1 *</Label>
              <Input
                id="option1"
                value={formData.option1}
                onChange={(e) => setFormData(prev => ({ ...prev, option1: e.target.value }))}
                placeholder="ตัวเลือกที่ 1"
              />
            </div>
            <div>
              <Label htmlFor="option2">ตัวเลือก 2 *</Label>
              <Input
                id="option2"
                value={formData.option2}
                onChange={(e) => setFormData(prev => ({ ...prev, option2: e.target.value }))}
                placeholder="ตัวเลือกที่ 2"
              />
            </div>
            <div>
              <Label htmlFor="option3">ตัวเลือก 3 *</Label>
              <Input
                id="option3"
                value={formData.option3}
                onChange={(e) => setFormData(prev => ({ ...prev, option3: e.target.value }))}
                placeholder="ตัวเลือกที่ 3"
              />
            </div>
            <div>
              <Label htmlFor="option4">ตัวเลือก 4 *</Label>
              <Input
                id="option4"
                value={formData.option4}
                onChange={(e) => setFormData(prev => ({ ...prev, option4: e.target.value }))}
                placeholder="ตัวเลือกที่ 4"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="correctAnswer">คำตอบที่ถูก *</Label>
              <Input
                id="correctAnswer"
                value={formData.correctAnswer}
                onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                placeholder="เช่น 1 หรือ 1,3 (สำหรับหลายคำตอบ)"
              />
              <div className="text-xs text-gray-500 mt-1">
                ใส่หมายเลขตัวเลือก (1-4) คั่นด้วยจุลภาค
              </div>
            </div>
            <div>
              <Label htmlFor="score">คะแนน *</Label>
              <Input
                id="score"
                type="number"
                min="1"
                value={formData.score}
                onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) || 1 }))}
                placeholder="คะแนน"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading} 
              className="flex-1"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}