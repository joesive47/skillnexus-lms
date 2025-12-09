"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Brain, Target, TrendingUp, Users, Plus, Edit, Trash2, BarChart3, Link, Eye, Settings, Upload, Download, FileSpreadsheet } from "lucide-react"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  skill: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  weight: number
}

interface Assessment {
  id: string
  title: string
  description: string
  category: string
  questions: Question[]
  timeLimit: number
  passingScore: number
  enabled: boolean
  recommendedCourses: string[]
}

interface AssessmentResult {
  id: string
  assessmentId: string
  userEmail: string
  score: number
  completedAt: string
  skillBreakdown: Record<string, number>
  recommendations: string[]
}

export default function SkillsAssessmentManagement() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [results, setResults] = useState<AssessmentResult[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "programming",
    timeLimit: 30,
    passingScore: 70,
    enabled: true
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    skill: "",
    difficulty: "beginner" as const,
    weight: 1
  })

  useEffect(() => {
    // Load saved assessments
    const savedAssessments = localStorage.getItem('skillAssessments')
    if (savedAssessments) {
      setAssessments(JSON.parse(savedAssessments))
    } else {
      // Default assessments
      const defaultAssessments: Assessment[] = [
        {
          id: "1",
          title: "Web Development Skills Assessment",
          description: "ประเมินทักษะการพัฒนาเว็บไซต์ HTML, CSS, JavaScript",
          category: "programming",
          questions: [],
          timeLimit: 45,
          passingScore: 70,
          enabled: true,
          recommendedCourses: [
            "HTML & CSS Fundamentals",
            "JavaScript Mastery",
            "React Development"
          ]
        },
        {
          id: "2",
          title: "Data Analytics Assessment",
          description: "ทดสอบความรู้ด้านการวิเคราะห์ข้อมูล Excel, SQL, Python",
          category: "data-science",
          questions: [],
          timeLimit: 60,
          passingScore: 75,
          enabled: true,
          recommendedCourses: [
            "Excel for Data Analysis",
            "SQL Database Mastery",
            "Python Data Science"
          ]
        }
      ]
      setAssessments(defaultAssessments)
      localStorage.setItem('skillAssessments', JSON.stringify(defaultAssessments))
    }

    // Load results
    const savedResults = localStorage.getItem('assessmentResults')
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      // Sample results
      const sampleResults: AssessmentResult[] = [
        {
          id: "r1",
          assessmentId: "1",
          userEmail: "john@example.com",
          score: 85,
          completedAt: "2024-12-06T10:30:00Z",
          skillBreakdown: {
            "HTML": 90,
            "CSS": 80,
            "JavaScript": 85
          },
          recommendations: ["JavaScript Mastery", "React Development"]
        },
        {
          id: "r2",
          assessmentId: "2",
          userEmail: "alice@example.com",
          score: 72,
          completedAt: "2024-12-06T14:15:00Z",
          skillBreakdown: {
            "Excel": 75,
            "SQL": 70,
            "Python": 70
          },
          recommendations: ["SQL Database Mastery", "Python Data Science"]
        }
      ]
      setResults(sampleResults)
      localStorage.setItem('assessmentResults', JSON.stringify(sampleResults))
    }
  }, [])

  const saveAssessments = (newAssessments: Assessment[]) => {
    setAssessments(newAssessments)
    localStorage.setItem('skillAssessments', JSON.stringify(newAssessments))
  }

  const handleCreateAssessment = () => {
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      ...formData,
      questions: questions,
      recommendedCourses: []
    }
    
    saveAssessments([...assessments, newAssessment])
    setIsCreating(false)
    setFormData({
      title: "",
      description: "",
      category: "programming",
      timeLimit: 30,
      passingScore: 70,
      enabled: true
    })
    setQuestions([])
  }

  const addQuestion = () => {
    if (!currentQuestion.text || !currentQuestion.skill) return
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      ...currentQuestion
    }
    
    setQuestions([...questions, newQuestion])
    setCurrentQuestion({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      skill: "",
      difficulty: "beginner",
      weight: 1
    })
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const toggleAssessment = (id: string) => {
    const updated = assessments.map(assessment =>
      assessment.id === id 
        ? { ...assessment, enabled: !assessment.enabled }
        : assessment
    )
    saveAssessments(updated)
  }

  const deleteAssessment = (id: string) => {
    if (confirm('คุณต้องการลบการประเมินนี้หรือไม่?')) {
      const updated = assessments.filter(assessment => assessment.id !== id)
      saveAssessments(updated)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        let jsonData: any[] = []
        
        if (file.name.endsWith('.csv')) {
          // Handle CSV files
          let text = event.target?.result as string
          if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1) // Remove BOM
          
          const lines = text.split('\n').filter(line => line.trim())
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
          
          jsonData = lines.slice(1).map(line => {
            const values = line.match(/"([^"]*)"|([^,]+)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || []
            const obj: any = {}
            headers.forEach((header, index) => {
              obj[header] = values[index] || ''
            })
            return obj
          })
        } else {
          // Handle Excel files
          const data = new Uint8Array(event.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          jsonData = XLSX.utils.sheet_to_json(worksheet)
        }
        
        const importedQuestions: Question[] = []
        
        jsonData.forEach((row, index) => {
          if (row.question_text || row.question_id) {
            const question: Question = {
              id: (Date.now() + index).toString(),
              text: row.question_text || '',
              options: [
                row.option_1 || '',
                row.option_2 || '',
                row.option_3 || '',
                row.option_4 || ''
              ],
              correctAnswer: Math.max(0, Math.min(3, parseInt(row.correct_answer) - 1)) || 0,
              skill: row.skill_name || 'General',
              difficulty: (row.difficulty_level?.toLowerCase() as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
              weight: Math.max(1, Math.min(5, parseInt(row.score))) || 1
            }
            
            if (question.text.trim()) {
              importedQuestions.push(question)
            }
          }
        })
        
        if (importedQuestions.length > 0) {
          setQuestions([...questions, ...importedQuestions])
          alert(`✅ นำเข้า ${importedQuestions.length} คำถามสำเร็จ!\n📊 รองรับทั้ง Excel และ CSV\n🔤 Headers ภาษาอังกฤษ + เนื้อหาภาษาไทย`)
        } else {
          alert('❌ ไม่พบข้อมูลคำถาม\nกรุณาตรวจสอบ:\n- ชื่อคอลัมน์ต้องเป็นภาษาอังกฤษ\n- มีข้อมูลในคอลัมน์ question_text')
        }
      } catch (error) {
        console.error('Import error:', error)
        alert('❌ เกิดข้อผิดพลาด\nกรุณาตรวจสอบ:\n- รูปแบบไฟล์ (.xlsx, .csv)\n- ชื่อคอลัมน์ภาษาอังกฤษ\n- ข้อมูลครบถ้วน')
      }
      
      e.target.value = ''
    }
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'utf-8')
    } else {
      reader.readAsArrayBuffer(file)
    }
  }

  const downloadTemplate = (format: 'excel' | 'csv' = 'excel') => {
    const link = document.createElement('a')
    if (format === 'csv') {
      link.href = '/skills-assessment-template-new.csv'
      link.download = 'Skills_Assessment_Template.csv'
    } else {
      link.href = '/skills-assessment-template-new.xlsx'
      link.download = 'Skills_Assessment_Template.xlsx'
    }
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            Skills Assessment Management
          </h1>
          <p className="text-gray-600">อาวุธการตลาดสุดยอด - ระบบประเมินทักษะและแนะนำหลักสูตร</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          สร้างการประเมินใหม่
        </Button>
      </div>

      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            การประเมิน
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            ผลการประเมิน
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            การวิเคราะห์
          </TabsTrigger>
          <TabsTrigger value="public-link" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            ลิงค์สาธารณะ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-6">
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>สร้างการประเมินทักษะใหม่</CardTitle>
                <CardDescription>ออกแบบการประเมินเพื่อวิเคราะห์ทักษะและแนะนำหลักสูตร</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">ชื่อการประเมิน</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="เช่น Web Development Assessment"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">หมวดหมู่</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="data-science">Data Science</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">คำอธิบาย</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="อธิบายสิ่งที่การประเมินนี้จะวัด"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="timeLimit">เวลา (นาที)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passingScore">คะแนนผ่าน (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({...formData, passingScore: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={formData.enabled}
                      onCheckedChange={(checked) => setFormData({...formData, enabled: checked})}
                    />
                    <Label>เปิดใช้งาน</Label>
                  </div>
                </div>

                {/* Add Questions */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">เพิ่มคำถาม</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={downloadTemplate}
                        className="flex items-center gap-1"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Template
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>คำถาม</Label>
                      <Textarea
                        value={currentQuestion.text}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                        placeholder="พิมพ์คำถาม"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index}>
                          <Label>ตัวเลือก {index + 1}</Label>
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options]
                              newOptions[index] = e.target.value
                              setCurrentQuestion({...currentQuestion, options: newOptions})
                            }}
                            placeholder={`ตัวเลือก ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label>คำตอบที่ถูก</Label>
                        <Select 
                          value={currentQuestion.correctAnswer.toString()} 
                          onValueChange={(value) => setCurrentQuestion({...currentQuestion, correctAnswer: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">ตัวเลือก 1</SelectItem>
                            <SelectItem value="1">ตัวเลือก 2</SelectItem>
                            <SelectItem value="2">ตัวเลือก 3</SelectItem>
                            <SelectItem value="3">ตัวเลือก 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>ทักษะที่วัด</Label>
                        <Input
                          value={currentQuestion.skill}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, skill: e.target.value})}
                          placeholder="เช่น JavaScript"
                        />
                      </div>
                      <div>
                        <Label>ระดับความยาก</Label>
                        <Select 
                          value={currentQuestion.difficulty} 
                          onValueChange={(value: any) => setCurrentQuestion({...currentQuestion, difficulty: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">เริ่มต้น</SelectItem>
                            <SelectItem value="intermediate">กลาง</SelectItem>
                            <SelectItem value="advanced">สูง</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>น้ำหนัก</Label>
                        <Input
                          type="number"
                          value={currentQuestion.weight}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, weight: parseInt(e.target.value)})}
                          min="1"
                          max="5"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={addQuestion} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        เพิ่มคำถาม
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('excel-import')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Import File
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => downloadTemplate('excel')}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Excel Template
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => downloadTemplate('csv')}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        CSV Template
                      </Button>
                    </div>
                    
                    <input
                      id="excel-import"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleExcelImport}
                    />
                  </div>
                </div>

                {/* Excel Import Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    ระบบ Import ใหม่ - English Headers + Thai Content
                  </h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">คอลัมน์หลัก (English Headers):</p>
                        <p>question_text, option_1-4, correct_answer</p>
                        <p>skill_name, difficulty_level, score</p>
                      </div>
                      <div>
                        <p className="font-medium">รองรับไฟล์:</p>
                        <p>✅ Excel (.xlsx, .xls)</p>
                        <p>✅ CSV (.csv)</p>
                      </div>
                    </div>
                    <p className="text-blue-600 font-medium">🎆 เนื้อหาคำถามสามารถใช้ภาษาไทยได้แล้ว!</p>
                  </div>
                </div>

                {/* Questions List */}
                {questions.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">คำถามที่เพิ่มแล้ว ({questions.length})</h3>
                    <div className="space-y-2">
                      {questions.map((question, index) => (
                        <div key={question.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{index + 1}. {question.text}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{question.skill}</Badge>
                              <Badge variant="secondary">{question.difficulty}</Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeQuestion(question.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={handleCreateAssessment} disabled={!formData.title || questions.length === 0}>
                    สร้างการประเมิน
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    ยกเลิก
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {assessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {assessment.title}
                        <Badge variant={assessment.enabled ? "default" : "secondary"}>
                          {assessment.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{assessment.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toggleAssessment(assessment.id)}>
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteAssessment(assessment.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{assessment.questions.length}</div>
                      <div className="text-sm text-gray-600">คำถาม</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{assessment.timeLimit}m</div>
                      <div className="text-sm text-gray-600">เวลา</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{assessment.passingScore}%</div>
                      <div className="text-sm text-gray-600">คะแนนผ่าน</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{results.filter(r => r.assessmentId === assessment.id).length}</div>
                      <div className="text-sm text-gray-600">ผู้ทำ</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      ดูตัวอย่าง
                    </Button>
                    <Button size="sm" variant="outline">
                      <Link className="w-4 h-4 mr-2" />
                      คัดลอกลิงค์
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">ผู้ทำการประเมินทั้งหมด</p>
                    <p className="text-3xl font-bold text-blue-600">{results.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">คะแนนเฉลี่ย</p>
                    <p className="text-3xl font-bold text-green-600">
                      {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">อัตราผ่าน</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {results.length > 0 ? Math.round((results.filter(r => r.score >= 70).length / results.length) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ผลการประเมินล่าสุด</CardTitle>
              <CardDescription>รายละเอียดผลการประเมินและคำแนะนำหลักสูตร</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result) => {
                  const assessment = assessments.find(a => a.id === result.assessmentId)
                  return (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{assessment?.title}</h4>
                          <p className="text-sm text-gray-600">{result.userEmail}</p>
                          <p className="text-xs text-gray-500">{new Date(result.completedAt).toLocaleString('th-TH')}</p>
                        </div>
                        <Badge className={getScoreBadge(result.score)}>
                          {result.score}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">การแบ่งคะแนนตามทักษะ:</h5>
                          <div className="space-y-1">
                            {Object.entries(result.skillBreakdown).map(([skill, score]) => (
                              <div key={skill} className="flex justify-between text-sm">
                                <span>{skill}:</span>
                                <span className={getScoreColor(score)}>{score}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">หลักสูตรแนะนำ:</h5>
                          <div className="space-y-1">
                            {result.recommendations.map((course, index) => (
                              <div key={index} className="text-sm">
                                <Badge variant="outline" className="mr-1">📚</Badge>
                                {course}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>การวิเคราะห์ผลการประเมิน</CardTitle>
              <CardDescription>สถิติและแนวโน้มการประเมินทักษะ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">กราฟและการวิเคราะห์เชิงลึกจะแสดงที่นี่</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public-link">
          <Card>
            <CardHeader>
              <CardTitle>ลิงค์สาธารณะสำหรับการประเมิน</CardTitle>
              <CardDescription>แชร์ลิงค์เหล่านี้ให้ลูกค้าทดสอบทักษะ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessments.filter(a => a.enabled).map((assessment) => (
                <div key={assessment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{assessment.title}</h4>
                      <p className="text-sm text-gray-600">{assessment.description}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/skills-test/{assessment.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Link className="w-4 h-4 mr-2" />
                        คัดลอก
                      </Button>
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดูหน้าทดสอบ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}