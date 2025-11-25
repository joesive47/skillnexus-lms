'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCareerWithQuestions, updateCareer, updateQuestion, deleteQuestion } from '@/app/actions/assessment'

const categories = [
  'Digital & Marketing',
  'Technology',
  'Design & Creative',
  'Business & Finance',
  'Healthcare',
  'Education',
  'อื่นๆ'
]

export default function EditAssessmentPage() {
  const router = useRouter()
  const params = useParams()
  const careerId = params.careerId as string

  const [career, setCareer] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)

  useEffect(() => {
    if (careerId) {
      loadCareerData()
    }
  }, [careerId])

  const loadCareerData = async () => {
    try {
      const data = await getCareerWithQuestions(careerId)
      if (data) {
        setCareer(data.career)
        setQuestions(data.questions)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading career:', error)
      setLoading(false)
    }
  }

  const handleSaveCareer = async () => {
    setSaving(true)
    try {
      const result = await updateCareer(careerId, {
        title: career.title,
        description: career.description,
        category: career.category
      })
      if (result.success) {
        alert('บันทึกข้อมูลสำเร็จ')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveQuestion = async (questionId: string, questionData: any) => {
    try {
      const result = await updateQuestion(questionId, questionData)
      if (result.success) {
        setEditingQuestion(null)
        loadCareerData()
      }
    } catch (error) {
      console.error('Save question error:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกคำถาม')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('คุณต้องการลบคำถามนี้หรือไม่?')) return
    
    try {
      const result = await deleteQuestion(questionId)
      if (result.success) {
        setQuestions(questions.filter(q => q.id !== questionId))
      }
    } catch (error) {
      console.error('Delete question error:', error)
      alert('เกิดข้อผิดพลาดในการลบคำถาม')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <p className="text-gray-600 mb-4">ไม่พบแบบประเมินที่ต้องการแก้ไข</p>
            <Button onClick={() => router.push('/skills-assessment/manage')}>
              กลับหน้าจัดการ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.push('/skills-assessment/manage')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าจัดการ
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">แก้ไขแบบประเมิน: {career.title}</h1>
        </div>

        {/* Career Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ข้อมูลแบบประเมิน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">ชื่อแบบประเมิน</Label>
              <Input
                id="title"
                value={career.title}
                onChange={(e) => setCareer({...career, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea
                id="description"
                value={career.description || ''}
                onChange={(e) => setCareer({...career, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="category">หมวดหมู่</Label>
              <Select value={career.category} onValueChange={(value) => setCareer({...career, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveCareer} disabled={saving} className="bg-gradient-to-r from-green-500 to-emerald-600">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </Button>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle>คำถาม ({questions.length} ข้อ)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  isEditing={editingQuestion === question.id}
                  onEdit={() => setEditingQuestion(question.id)}
                  onSave={(data: any) => handleSaveQuestion(question.id, data)}
                  onCancel={() => setEditingQuestion(null)}
                  onDelete={() => handleDeleteQuestion(question.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuestionCard({ question, index, isEditing, onEdit, onSave, onCancel, onDelete }: any) {
  const [editData, setEditData] = useState({
    questionText: question.questionText,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    correctAnswer: question.correctAnswer,
    score: question.score
  })

  const handleSave = () => {
    onSave(editData)
  }

  if (isEditing) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4 space-y-4">
          <div>
            <Label>คำถาม</Label>
            <Textarea
              value={editData.questionText}
              onChange={(e) => setEditData({...editData, questionText: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ตัวเลือก 1</Label>
              <Input
                value={editData.option1}
                onChange={(e) => setEditData({...editData, option1: e.target.value})}
              />
            </div>
            <div>
              <Label>ตัวเลือก 2</Label>
              <Input
                value={editData.option2}
                onChange={(e) => setEditData({...editData, option2: e.target.value})}
              />
            </div>
            <div>
              <Label>ตัวเลือก 3</Label>
              <Input
                value={editData.option3}
                onChange={(e) => setEditData({...editData, option3: e.target.value})}
              />
            </div>
            <div>
              <Label>ตัวเลือก 4</Label>
              <Input
                value={editData.option4}
                onChange={(e) => setEditData({...editData, option4: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>คำตอบที่ถูกต้อง (เช่น 1,2 หรือ 3)</Label>
              <Input
                value={editData.correctAnswer}
                onChange={(e) => setEditData({...editData, correctAnswer: e.target.value})}
              />
            </div>
            <div>
              <Label>คะแนน</Label>
              <Input
                type="number"
                value={editData.score}
                onChange={(e) => setEditData({...editData, score: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="bg-green-600">
              <Save className="w-4 h-4 mr-1" />
              บันทึก
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              ยกเลิก
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">คำถามที่ {index + 1}</h4>
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              แก้ไข
            </Button>
            <Button onClick={onDelete} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-1" />
              ลบ
            </Button>
          </div>
        </div>
        <p className="text-gray-700 mb-3">{question.questionText}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>1. {question.option1}</div>
          <div>2. {question.option2}</div>
          <div>3. {question.option3}</div>
          <div>4. {question.option4}</div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">คำตอบที่ถูก:</span> {question.correctAnswer} | 
          <span className="font-medium"> คะแนน:</span> {question.score}
        </div>
      </CardContent>
    </Card>
  )
}