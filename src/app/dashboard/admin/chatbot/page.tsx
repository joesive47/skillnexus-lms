'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { id: 1, question: 'หลักสูตรมีอะไรบ้าง?', answer: 'เรามีหลักสูตรด้านเทคโนโลยี การตลาด และการจัดการ', active: true },
    { id: 2, question: 'วิธีการสมัครเรียน?', answer: 'สามารถสมัครผ่านเว็บไซต์หรือติดต่อทีมงาน', active: true }
  ])
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')

  const addMessage = () => {
    if (newQuestion && newAnswer) {
      setMessages([...messages, {
        id: Date.now(),
        question: newQuestion,
        answer: newAnswer,
        active: true
      }])
      setNewQuestion('')
      setNewAnswer('')
    }
  }

  const toggleMessage = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, active: !msg.active } : msg
    ))
  }

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">จัดการ Chatbot</h1>
        <p className="text-muted-foreground">จัดการคำถาม-คำตอบของ Chatbot</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>เพิ่มคำถาม-คำตอบใหม่</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="คำถาม"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <Textarea
              placeholder="คำตอบ"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <Button onClick={addMessage} className="w-full">
              เพิ่มคำถาม-คำตอบ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>สถิติการใช้งาน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>คำถามทั้งหมด:</span>
                <span className="font-bold">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>คำถามที่เปิดใช้งาน:</span>
                <span className="font-bold">{messages.filter(m => m.active).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการคำถาม-คำตอบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{msg.question}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={msg.active ? 'default' : 'secondary'}>
                      {msg.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleMessage(msg.id)}
                    >
                      {msg.active ? 'ปิด' : 'เปิด'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      ลบ
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground">{msg.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}