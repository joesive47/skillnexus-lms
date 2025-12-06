'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function VoiceAssignmentsPage() {
  const [lessons, setLessons] = useState<any[]>([])
  const [selectedLesson, setSelectedLesson] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    instruction: '',
    targetText: '',
    keywords: '',
    minWords: 50,
    maxDuration: 120,
    passingScore: 70,
    maxAttempts: 3
  })

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    const res = await fetch('/api/lessons')
    if (res.ok) {
      const data = await res.json()
      setLessons(data.lessons || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const keywords = formData.keywords.split(',').map(k => k.trim()).filter(Boolean)

    const res = await fetch('/api/voice/assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: selectedLesson,
        ...formData,
        keywords
      })
    })

    if (res.ok) {
      alert('สร้าง Voice Assignment สำเร็จ!')
      setFormData({
        title: '',
        instruction: '',
        targetText: '',
        keywords: '',
        minWords: 50,
        maxDuration: 120,
        passingScore: 70,
        maxAttempts: 3
      })
      setSelectedLesson('')
    } else {
      alert('เกิดข้อผิดพลาด')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">🎤 จัดการ Voice Practice</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>เลือกบทเรียน</Label>
            <Select value={selectedLesson} onValueChange={setSelectedLesson}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกบทเรียน" />
              </SelectTrigger>
              <SelectContent>
                {lessons.map(lesson => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    {lesson.title || `Lesson ${lesson.order}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>ชื่อแบบฝึกหัด</Label>
            <Input
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="เช่น: ฝึกพูดแนะนำตัว"
              required
            />
          </div>

          <div>
            <Label>คำแนะนำ</Label>
            <Textarea
              value={formData.instruction}
              onChange={e => setFormData({ ...formData, instruction: e.target.value })}
              placeholder="อธิบายสิ่งที่นักเรียนต้องทำ"
              rows={3}
              required
            />
          </div>

          <div>
            <Label>ข้อความที่ต้องอ่าน (ถ้ามี)</Label>
            <Textarea
              value={formData.targetText}
              onChange={e => setFormData({ ...formData, targetText: e.target.value })}
              placeholder="ข้อความที่ต้องการให้นักเรียนอ่าน"
              rows={3}
            />
          </div>

          <div>
            <Label>คำสำคัญ (คั่นด้วยเครื่องหมายจุลภาค)</Label>
            <Input
              value={formData.keywords}
              onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="learning, education, technology"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>จำนวนคำขั้นต่ำ</Label>
              <Input
                type="number"
                value={formData.minWords}
                onChange={e => setFormData({ ...formData, minWords: parseInt(e.target.value) })}
                min={10}
              />
            </div>

            <div>
              <Label>เวลาสูงสุด (วินาที)</Label>
              <Input
                type="number"
                value={formData.maxDuration}
                onChange={e => setFormData({ ...formData, maxDuration: parseInt(e.target.value) })}
                min={30}
              />
            </div>

            <div>
              <Label>คะแนนผ่าน (%)</Label>
              <Input
                type="number"
                value={formData.passingScore}
                onChange={e => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                min={0}
                max={100}
              />
            </div>

            <div>
              <Label>จำนวนครั้งที่ลองได้</Label>
              <Input
                type="number"
                value={formData.maxAttempts}
                onChange={e => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                min={1}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            สร้าง Voice Assignment
          </Button>
        </form>
      </Card>

      <Card className="p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">💡 คำแนะนำ</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>FREE Mode:</strong> ใช้ Web Speech API ของเบราว์เซอร์ (ฟรี)</p>
          <p>• <strong>PREMIUM Mode:</strong> ใช้ OpenAI Whisper + GPT-4 (5 เครดิต/ครั้ง)</p>
          <p>• นักเรียนสามารถเลือกโหมดได้เอง</p>
          <p>• ระบบจะวิเคราะห์และให้ Feedback อัตโนมัติ</p>
        </div>
      </Card>
    </div>
  )
}
