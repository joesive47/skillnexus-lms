"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, MessageSquare, Settings, Brain, Plus, Edit, Trash2, Save } from "lucide-react"

interface ChatbotConfig {
  enabled: boolean
  name: string
  greeting: string
  personality: string
  responseStyle: string
  quickReplies: string[]
  fallbackMessage: string
}

interface KnowledgeItem {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
}

export default function ChatbotManagement() {
  const [config, setConfig] = useState<ChatbotConfig>({
    enabled: true,
    name: "upPowerSkill Assistant",
    greeting: "สวัสดีครับ! ผมคือ AI Assistant ของ upPowerSkill พร้อมช่วยเหลือคุณในการเรียนรู้ 🤖",
    personality: "friendly",
    responseStyle: "conversational",
    quickReplies: [
      "หลักสูตรแนะนำ",
      "วิธีการเรียน",
      "ติดต่อสนับสนุน",
      "ข้อมูลใบประกาศนียบัตร"
    ],
    fallbackMessage: "ขออภัยครับ ผมไม่เข้าใจคำถามของคุณ กรุณาลองถามใหม่หรือติดต่อทีมสนับสนุนได้เลยครับ"
  })

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([])
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false)
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeItem | null>(null)
  const [newKnowledge, setNewKnowledge] = useState({
    question: "",
    answer: "",
    category: "general",
    keywords: ""
  })

  useEffect(() => {
    const savedConfig = localStorage.getItem('chatbotConfig')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }

    const savedKnowledge = localStorage.getItem('chatbotKnowledge')
    if (savedKnowledge) {
      setKnowledgeBase(JSON.parse(savedKnowledge))
    } else {
      const defaultKnowledge: KnowledgeItem[] = [
        {
          id: "1",
          question: "upPowerSkill คืออะไร?",
          answer: "upPowerSkill เป็นแพลตฟอร์มการเรียนรู้ออนไลน์ที่ใช้ AI ช่วยในการเรียนการสอน มีหลักสูตรหลากหลายและระบบป้องกันการข้ามเนื้อหา",
          category: "about",
          keywords: ["upPowerSkill", "คืออะไร", "แพลตฟอร์ม", "เรียนออนไลน์"]
        },
        {
          id: "2", 
          question: "วิธีการสมัครเรียน",
          answer: "คุณสามารถสมัครเรียนได้โดยคลิกปุ่ม 'สมัครสมาชิก' แล้วกรอกข้อมูลส่วนตัว หลังจากนั้นเลือกหลักสูตรที่สนใจและทำการชำระเงิน",
          category: "enrollment",
          keywords: ["สมัคร", "เรียน", "ลงทะเบียน", "วิธีการ"]
        },
        {
          id: "3",
          question: "ใบประกาศนียบัตรมีความน่าเชื่อถือไหม?",
          answer: "ใบประกาศนียบัตรของเรามีการรับรองและสามารถตรวจสอบได้ผ่านระบบ Blockchain เพื่อความน่าเชื่อถือสูงสุด",
          category: "certificate",
          keywords: ["ใบประกาศนียบัตร", "รับรอง", "น่าเชื่อถือ", "Blockchain"]
        }
      ]
      setKnowledgeBase(defaultKnowledge)
      localStorage.setItem('chatbotKnowledge', JSON.stringify(defaultKnowledge))
    }
  }, [])

  const saveConfig = () => {
    localStorage.setItem('chatbotConfig', JSON.stringify(config))
    alert('บันทึกการตั้งค่าเรียบร้อย!')
  }

  const saveKnowledge = (knowledge: KnowledgeItem[]) => {
    setKnowledgeBase(knowledge)
    localStorage.setItem('chatbotKnowledge', JSON.stringify(knowledge))
  }

  const handleAddKnowledge = () => {
    if (!newKnowledge.question || !newKnowledge.answer) return

    const knowledge: KnowledgeItem = {
      id: Date.now().toString(),
      question: newKnowledge.question,
      answer: newKnowledge.answer,
      category: newKnowledge.category,
      keywords: newKnowledge.keywords.split(',').map(k => k.trim()).filter(k => k)
    }

    saveKnowledge([...knowledgeBase, knowledge])
    setNewKnowledge({ question: "", answer: "", category: "general", keywords: "" })
    setIsAddingKnowledge(false)
  }

  const handleEditKnowledge = (item: KnowledgeItem) => {
    setNewKnowledge({
      question: item.question,
      answer: item.answer,
      category: item.category,
      keywords: item.keywords.join(', ')
    })
    setEditingKnowledge(item)
    setIsAddingKnowledge(true)
  }

  const handleUpdateKnowledge = () => {
    if (!editingKnowledge || !newKnowledge.question || !newKnowledge.answer) return

    const updatedKnowledge = knowledgeBase.map(item =>
      item.id === editingKnowledge.id
        ? {
            ...item,
            question: newKnowledge.question,
            answer: newKnowledge.answer,
            category: newKnowledge.category,
            keywords: newKnowledge.keywords.split(',').map(k => k.trim()).filter(k => k)
          }
        : item
    )

    saveKnowledge(updatedKnowledge)
    setNewKnowledge({ question: "", answer: "", category: "general", keywords: "" })
    setEditingKnowledge(null)
    setIsAddingKnowledge(false)
  }

  const handleDeleteKnowledge = (id: string) => {
    if (confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) {
      const updatedKnowledge = knowledgeBase.filter(item => item.id !== id)
      saveKnowledge(updatedKnowledge)
    }
  }

  const addQuickReply = () => {
    const reply = prompt('เพิ่มคำตอบด่วน:')
    if (reply) {
      setConfig({
        ...config,
        quickReplies: [...config.quickReplies, reply]
      })
    }
  }

  const removeQuickReply = (index: number) => {
    const newReplies = config.quickReplies.filter((_, i) => i !== index)
    setConfig({
      ...config,
      quickReplies: newReplies
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="w-8 h-8" />
            Chatbot Management
          </h1>
          <p className="text-gray-600">จัดการ AI Assistant และฐานความรู้</p>
        </div>
        <Button onClick={saveConfig} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          บันทึกการตั้งค่า
        </Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            การตั้งค่า
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            ฐานความรู้
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            ตัวอย่าง
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>การตั้งค่าพื้นฐาน</CardTitle>
              <CardDescription>กำหนดพฤติกรรมและบุคลิกของ Chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enabled">เปิดใช้งาน Chatbot</Label>
                  <p className="text-sm text-gray-600">แสดง Chatbot บนเว็บไซต์</p>
                </div>
                <Switch
                  id="enabled"
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig({...config, enabled: checked})}
                />
              </div>

              <div>
                <Label htmlFor="name">ชื่อ Chatbot</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  placeholder="ชื่อของ AI Assistant"
                />
              </div>

              <div>
                <Label htmlFor="greeting">ข้อความทักทาย</Label>
                <Textarea
                  id="greeting"
                  value={config.greeting}
                  onChange={(e) => setConfig({...config, greeting: e.target.value})}
                  placeholder="ข้อความแรกที่ผู้ใช้จะเห็น"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personality">บุคลิกภาพ</Label>
                  <Select value={config.personality} onValueChange={(value) => setConfig({...config, personality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">เป็นมิตร</SelectItem>
                      <SelectItem value="professional">เป็นทางการ</SelectItem>
                      <SelectItem value="casual">สบายๆ</SelectItem>
                      <SelectItem value="enthusiastic">กระตือรือร้น</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="responseStyle">รูปแบบการตอบ</Label>
                  <Select value={config.responseStyle} onValueChange={(value) => setConfig({...config, responseStyle: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversational">สนทนา</SelectItem>
                      <SelectItem value="informative">ให้ข้อมูล</SelectItem>
                      <SelectItem value="concise">กระชับ</SelectItem>
                      <SelectItem value="detailed">ละเอียด</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="fallback">ข้อความเมื่อไม่เข้าใจ</Label>
                <Textarea
                  id="fallback"
                  value={config.fallbackMessage}
                  onChange={(e) => setConfig({...config, fallbackMessage: e.target.value})}
                  placeholder="ข้อความเมื่อ AI ไม่สามารถตอบได้"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>คำตอบด่วน</CardTitle>
              <CardDescription>ปุ่มคำตอบที่ผู้ใช้สามารถคลิกได้</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {config.quickReplies.map((reply, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{reply}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeQuickReply(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addQuickReply} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มคำตอบด่วน
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>ฐานความรู้</CardTitle>
                  <CardDescription>จัดการคำถาม-คำตอบสำหรับ Chatbot</CardDescription>
                </div>
                <Button onClick={() => setIsAddingKnowledge(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มความรู้
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAddingKnowledge && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>{editingKnowledge ? 'แก้ไขความรู้' : 'เพิ่มความรู้ใหม่'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="question">คำถาม</Label>
                      <Input
                        id="question"
                        value={newKnowledge.question}
                        onChange={(e) => setNewKnowledge({...newKnowledge, question: e.target.value})}
                        placeholder="คำถามที่ผู้ใช้อาจจะถาม"
                      />
                    </div>

                    <div>
                      <Label htmlFor="answer">คำตอบ</Label>
                      <Textarea
                        id="answer"
                        value={newKnowledge.answer}
                        onChange={(e) => setNewKnowledge({...newKnowledge, answer: e.target.value})}
                        placeholder="คำตอบที่ Chatbot จะให้"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">หมวดหมู่</Label>
                        <Select value={newKnowledge.category} onValueChange={(value) => setNewKnowledge({...newKnowledge, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">ทั่วไป</SelectItem>
                            <SelectItem value="about">เกี่ยวกับเรา</SelectItem>
                            <SelectItem value="enrollment">การสมัครเรียน</SelectItem>
                            <SelectItem value="certificate">ใบประกาศนียบัตร</SelectItem>
                            <SelectItem value="technical">เทคนิค</SelectItem>
                            <SelectItem value="support">การสนับสนุน</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="keywords">คำสำคัญ (คั่นด้วยจุลภาค)</Label>
                        <Input
                          id="keywords"
                          value={newKnowledge.keywords}
                          onChange={(e) => setNewKnowledge({...newKnowledge, keywords: e.target.value})}
                          placeholder="คำสำคัญ, คีย์เวิร์ด, หัวข้อ"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={editingKnowledge ? handleUpdateKnowledge : handleAddKnowledge}>
                        {editingKnowledge ? 'อัพเดท' : 'เพิ่ม'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingKnowledge(false)
                          setEditingKnowledge(null)
                          setNewKnowledge({ question: "", answer: "", category: "general", keywords: "" })
                        }}
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {knowledgeBase.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{item.category}</Badge>
                          </div>
                          <h4 className="font-medium mb-2">{item.question}</h4>
                          <p className="text-gray-600 text-sm mb-2">{item.answer}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button size="sm" variant="ghost" onClick={() => handleEditKnowledge(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteKnowledge(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>ตัวอย่าง Chatbot</CardTitle>
              <CardDescription>ดูตัวอย่างการทำงานของ Chatbot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50 max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{config.name}</span>
                  <Badge variant={config.enabled ? "default" : "secondary"}>
                    {config.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                  </Badge>
                </div>
                
                <div className="bg-white p-3 rounded-lg mb-4 shadow-sm">
                  <p className="text-sm">{config.greeting}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-600 mb-2">คำตอบด่วน:</p>
                  {config.quickReplies.slice(0, 3).map((reply, index) => (
                    <Button key={index} variant="outline" size="sm" className="text-xs mr-2 mb-2">
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}