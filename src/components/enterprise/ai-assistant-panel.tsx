'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  BookOpen, 
  Brain, 
  Target, 
  Lightbulb,
  Loader2
} from 'lucide-react'

export default function AIAssistantPanel() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const generateQuiz = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/enterprise/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateQuiz',
          topic: 'JavaScript Fundamentals',
          difficulty: 'medium',
          questionCount: 5
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Error generating quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateLesson = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/enterprise/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateLesson',
          title: 'Introduction to React Hooks',
          objectives: [
            'Understand useState hook',
            'Learn useEffect hook',
            'Apply hooks in practice'
          ],
          duration: 45
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Error generating lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeProgress = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/enterprise/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyzeProgress',
          studentId: 'student-123'
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Error analyzing progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Learning Assistant
          </CardTitle>
          <CardDescription>
            Advanced AI-powered tools for content generation and learning analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content Generation</TabsTrigger>
              <TabsTrigger value="analysis">Learning Analysis</TabsTrigger>
              <TabsTrigger value="tutoring">Intelligent Tutoring</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-4 w-4" />
                      Quiz Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="topic">Topic</Label>
                      <Input id="topic" placeholder="Enter topic..." />
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={generateQuiz} disabled={loading} className="w-full">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Generate Quiz
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-4 w-4" />
                      Lesson Creator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="lesson-title">Lesson Title</Label>
                      <Input id="lesson-title" placeholder="Enter lesson title..." />
                    </div>
                    <div>
                      <Label htmlFor="objectives">Learning Objectives</Label>
                      <Textarea id="objectives" placeholder="Enter objectives..." />
                    </div>
                    <Button onClick={generateLesson} disabled={loading} className="w-full">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Generate Lesson
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Student Progress Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" placeholder="Enter student ID..." />
                  </div>
                  <Button onClick={analyzeProgress} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Analyze Progress
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tutoring" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Intelligent Feedback System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Textarea id="question" placeholder="Enter question..." />
                  </div>
                  <div>
                    <Label htmlFor="answer">Student Answer</Label>
                    <Textarea id="answer" placeholder="Enter student answer..." />
                  </div>
                  <Button disabled={loading} className="w-full">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Provide Feedback
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>AI Generated Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(results) ? (
                results.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">{item.question || item.title}</h3>
                    {item.options && (
                      <div className="space-y-1">
                        {item.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <Badge variant={optIndex === item.correctAnswer ? "default" : "secondary"}>
                              {String.fromCharCode(65 + optIndex)}
                            </Badge>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.explanation && (
                      <p className="text-sm text-muted-foreground mt-2">{item.explanation}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 border rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}