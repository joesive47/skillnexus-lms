'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Bot, User, Send, Upload, Download, Plus, Trash2, FileText, RefreshCw, Database, Zap } from 'lucide-react'
import { ExcelQAImport } from '@/components/chatbot/excel-qa-import'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

interface KnowledgeItem {
  id: string
  question: string
  answer: string
  category: string
  isActive: boolean
  createdAt: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'สวัสดีครับ! ผมเป็น AI Assistant ของ SkillNexus LMS พร้อมช่วยเหลือคุณเรื่องหลักสูตรและการเรียนรู้ มีอะไรให้ช่วยไหมครับ?',
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([])
  const [newItem, setNewItem] = useState({ question: '', answer: '', category: 'general' })
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, active: 0, categories: 0 })

  useEffect(() => {
    loadKnowledgeBase()
    loadFromJSON()
  }, [])

  const loadFromJSON = async () => {
    try {
      const response = await fetch('/knowledge-base-1763982823686.json')
      if (response.ok) {
        const data = await response.json()
        if (data.knowledge && Array.isArray(data.knowledge)) {
          const items = data.knowledge.map((item: any, index: number) => ({
            id: item.id || `json-${index}`,
            question: extractQuestion(item.content),
            answer: item.content,
            category: 'skillnexus',
            isActive: true,
            createdAt: new Date().toISOString()
          }))
          setKnowledgeBase(prev => [...prev, ...items])
          updateStats([...knowledgeBase, ...items])
        }
      }
    } catch (error) {
      console.log('ไม่พบไฟล์ JSON หรือเกิดข้อผิดพลาด')
    }
  }

  const extractQuestion = (content: string): string => {
    const lines = content.split('\n')
    const firstLine = lines[0] || content.substring(0, 100)
    return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine
  }

  const loadKnowledgeBase = async () => {
    try {
      const response = await fetch('/api/chatbot/knowledge-base')
      if (response.ok) {
        const data = await response.json()
        setKnowledgeBase(Array.isArray(data) ? data : [])
        updateStats(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error loading knowledge base:', error)
      setKnowledgeBase([])
    }
  }

  const updateStats = (items: KnowledgeItem[]) => {
    const total = items.length
    const active = items.filter(item => item.isActive).length
    const categories = new Set(items.map(item => item.category)).size
    setStats({ total, active, categories })
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      // Simple local search first
      const localAnswer = findLocalAnswer(currentInput)
      if (localAnswer) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: localAnswer,
          isBot: true,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
        setIsLoading(false)
        return
      }

      // Try API if local search fails
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, sessionId: 'chatbot-page' })
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response || 'ขออภัยครับ ไม่สามารถตอบคำถามนี้ได้ในขณะนี้',
          isBot: true,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error('API Error')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'ขออภัยครับ เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง',
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const findLocalAnswer = (question: string): string | null => {
    const q = question.toLowerCase()
    
    // SkillNexus specific answers
    if (q.includes('skillnexus') || q.includes('skill nexus')) {
      return 'SkillNexus LMS เป็นระบบจัดการการเรียนรู้ที่ทันสมัย มีฟีเจอร์ Anti-Skip Video Player, SCORM Support, AI Recommendations และ PWA ที่ช่วยให้การเรียนรู้มีประสิทธิภาพมากขึ้น'
    }
    
    if (q.includes('anti-skip') || q.includes('ข้ามวิดีโอ')) {
      return 'Anti-Skip Video Player เป็นฟีเจอร์ที่ป้องกันผู้เรียนข้ามเนื้อหาวิดีโอ เพื่อให้มั่นใจว่าผู้เรียนรับชมเนื้อหาครบถ้วนตามหลักสูตร'
    }
    
    if (q.includes('scorm')) {
      return 'ระบบรองรับมาตรฐาน SCORM (SCORM 1.2 และ SCORM 2004) ทำให้สามารถนำเข้าคอนเทนต์ eLearning จากเครื่องมือภายนอกได้'
    }
    
    if (q.includes('pwa') || q.includes('progressive web app')) {
      return 'PWA (Progressive Web App) ทำให้ SkillNexus ทำงานเหมือนแอปมือถือ สามารถติดตั้งบนหน้าจอหลัก ใช้งานออฟไลน์ได้บางส่วน'
    }
    
    if (q.includes('ai') || q.includes('ปัญญาประดิษฐ์')) {
      return 'ระบบ AI ใน SkillNexus ช่วยแนะนำหลักสูตรที่เหมาะสม วิเคราะห์ความคืบหน้าการเรียน และสร้างเส้นทางการเรียนรู้ที่เหมาะกับแต่ละบุคคล'
    }
    
    // Search in knowledge base
    for (const item of knowledgeBase) {
      if (item.isActive && 
          (item.question.toLowerCase().includes(q) || 
           item.answer.toLowerCase().includes(q))) {
        return item.answer
      }
    }
    
    return null
  }

  const addNewItem = async () => {
    if (!newItem.question.trim() || !newItem.answer.trim()) {
      alert('กรุณากรอกคำถามและคำตอบ')
      return
    }

    const item: KnowledgeItem = {
      id: Date.now().toString(),
      question: newItem.question,
      answer: newItem.answer,
      category: newItem.category,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    setKnowledgeBase(prev => [...prev, item])
    setNewItem({ question: '', answer: '', category: 'general' })
    updateStats([...knowledgeBase, item])
    alert('เพิ่มข้อมูลสำเร็จ')
  }

  const deleteItem = (id: string) => {
    if (!confirm('ต้องการลบข้อมูลนี้หรือไม่?')) return
    
    const updated = knowledgeBase.filter(item => item.id !== id)
    setKnowledgeBase(updated)
    updateStats(updated)
    alert('ลบข้อมูลสำเร็จ')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { text: 'SkillNexus LMS คืออะไร?', action: () => setInputMessage('SkillNexus LMS คืออะไร?') },
    { text: 'ฟีเจอร์ Anti-Skip Video Player', action: () => setInputMessage('ฟีเจอร์ Anti-Skip Video Player คืออะไร?') },
    { text: 'การรองรับ SCORM', action: () => setInputMessage('ระบบรองรับ SCORM อย่างไร?') },
    { text: 'ระบบ AI Recommendations', action: () => setInputMessage('ระบบ AI Recommendations ทำงานอย่างไร?') }
  ]

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-500" />
          SkillNexus AI Chatbot
        </h1>
        <p className="text-gray-600">ระบบ AI Assistant สำหรับตอบคำถามเกี่ยวกับ SkillNexus LMS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">ข้อมูล Knowledge Base</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-gray-600">ข้อมูลที่ใช้งานได้</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.categories}</p>
                <p className="text-sm text-gray-600">หมวดหมู่</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card className="h-[700px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              ทดสอบ Chatbot
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString('th-TH')}
                    </p>
                  </div>

                  {!message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">คำถามที่ถามบ่อย:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="text-xs h-8"
                  >
                    {action.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="พิมพ์คำถามของคุณ..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Management */}
        <div className="space-y-6">
          {/* Excel Import */}
          <ExcelQAImport onImportSuccess={loadKnowledgeBase} />

          {/* Add New Knowledge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                เพิ่มข้อมูล Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="คำถาม"
                value={newItem.question}
                onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
              />
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="คำตอบ"
                rows={3}
                value={newItem.answer}
                onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
              />
              <select
                className="w-full p-2 border rounded-md"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="general">ทั่วไป</option>
                <option value="skillnexus">SkillNexus</option>
                <option value="course">หลักสูตร</option>
                <option value="technical">เทคนิค</option>
              </select>
              <Button onClick={addNewItem} className="w-full">
                เพิ่มข้อมูล
              </Button>
            </CardContent>
          </Card>

          {/* Knowledge Base List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ข้อมูล Knowledge Base</CardTitle>
                <Button size="sm" variant="outline" onClick={loadKnowledgeBase}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  รีเฟรช
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {knowledgeBase.slice(0, 10).map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.question}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {item.answer.substring(0, 100)}...
                        </p>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                          {item.category}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {knowledgeBase.length === 0 && (
                  <p className="text-center text-gray-500 py-8">ยังไม่มีข้อมูล Knowledge Base</p>
                )}
                {knowledgeBase.length > 10 && (
                  <p className="text-center text-gray-500 text-sm">
                    แสดง 10 รายการแรก จากทั้งหมด {knowledgeBase.length} รายการ
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}