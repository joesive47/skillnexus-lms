'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Star,
  Lightbulb,
  Zap,
  ChevronRight,
  Play,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react'

interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  progress: number
  courses: {
    id: string
    title: string
    completed: boolean
    recommended: boolean
  }[]
  skills: string[]
}

interface Recommendation {
  id: string
  type: 'course' | 'skill' | 'practice' | 'review'
  title: string
  description: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  confidence: number
}

interface LearningInsight {
  type: 'strength' | 'weakness' | 'trend' | 'suggestion'
  title: string
  description: string
  metric?: number
  change?: number
  icon: string
}

export default function PersonalizedLearning() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [insights, setInsights] = useState<LearningInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI-powered data loading
    setTimeout(() => {
      setLearningPaths([
        {
          id: '1',
          title: 'Full-Stack JavaScript Developer',
          description: 'เส้นทางการเรียนรู้ที่ครอบคลุมทั้ง Frontend และ Backend',
          difficulty: 'intermediate',
          estimatedTime: '6 เดือน',
          progress: 65,
          courses: [
            { id: '1', title: 'JavaScript Fundamentals', completed: true, recommended: false },
            { id: '2', title: 'React Development', completed: true, recommended: false },
            { id: '3', title: 'Node.js Backend', completed: false, recommended: true },
            { id: '4', title: 'Database Design', completed: false, recommended: true },
            { id: '5', title: 'DevOps Basics', completed: false, recommended: false }
          ],
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git']
        },
        {
          id: '2',
          title: 'Data Science with Python',
          description: 'เรียนรู้การวิเคราะห์ข้อมูลและ Machine Learning',
          difficulty: 'advanced',
          estimatedTime: '8 เดือน',
          progress: 25,
          courses: [
            { id: '6', title: 'Python Basics', completed: true, recommended: false },
            { id: '7', title: 'Data Analysis with Pandas', completed: false, recommended: true },
            { id: '8', title: 'Machine Learning', completed: false, recommended: false },
            { id: '9', title: 'Deep Learning', completed: false, recommended: false }
          ],
          skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow']
        }
      ])

      setRecommendations([
        {
          id: '1',
          type: 'course',
          title: 'Node.js Backend Development',
          description: 'ต่อยอดจาก React ที่คุณเรียนจบแล้ว',
          reason: 'คุณมีพื้นฐาน JavaScript ที่แข็งแกร่งและเพิ่งจบ React',
          priority: 'high',
          estimatedTime: '4 สัปดาห์',
          confidence: 92
        },
        {
          id: '2',
          type: 'practice',
          title: 'JavaScript Algorithm Practice',
          description: 'ฝึกฝนทักษะการแก้ปัญหาด้วย Algorithm',
          reason: 'คะแนนในส่วน Problem Solving ยังต่ำกว่าค่าเฉลี่ย',
          priority: 'medium',
          estimatedTime: '30 นาที/วัน',
          confidence: 78
        },
        {
          id: '3',
          type: 'review',
          title: 'ทบทวน React Hooks',
          description: 'ทบทวนเนื้อหาที่คุณยังไม่เข้าใจเต็มที่',
          reason: 'ผลการทดสอบ React Hooks อยู่ที่ 65%',
          priority: 'medium',
          estimatedTime: '2 ชั่วโมง',
          confidence: 85
        },
        {
          id: '4',
          type: 'skill',
          title: 'TypeScript Fundamentals',
          description: 'เพิ่มทักษะ TypeScript เพื่อเขียนโค้ดที่ปลอดภัยขึ้น',
          reason: 'TypeScript เป็นทักษะที่ต้องการในตลาดงาน',
          priority: 'low',
          estimatedTime: '3 สัปดาห์',
          confidence: 71
        }
      ])

      setInsights([
        {
          type: 'strength',
          title: 'จุดแข็ง: Frontend Development',
          description: 'คุณมีความเข้าใจ React และ CSS ในระดับดีมาก',
          metric: 88,
          icon: '💪'
        },
        {
          type: 'weakness',
          title: 'จุดที่ควรพัฒนา: Backend Knowledge',
          description: 'ควรเพิ่มความรู้ด้าน Server-side และ Database',
          metric: 45,
          icon: '📈'
        },
        {
          type: 'trend',
          title: 'แนวโน้มการเรียน',
          description: 'ความสม่ำเสมอในการเรียนเพิ่มขึ้น 23% ในเดือนนี้',
          metric: 23,
          change: 23,
          icon: '📊'
        },
        {
          type: 'suggestion',
          title: 'คำแนะนำ',
          description: 'ลองทำโปรเจกต์จริงเพื่อประยุกต์ความรู้ที่เรียนมา',
          icon: '💡'
        }
      ])

      setLoading(false)
    }, 1500)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600'
      case 'intermediate': return 'bg-yellow-600'
      case 'advanced': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10'
      case 'medium': return 'border-yellow-500 bg-yellow-500/10'
      case 'low': return 'border-green-500 bg-green-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />
      case 'skill': return <Zap className="w-4 h-4" />
      case 'practice': return <Target className="w-4 h-4" />
      case 'review': return <BarChart3 className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">AI กำลังวิเคราะห์ข้อมูลการเรียนของคุณ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-400" />
            AI Personalized Learning
          </h1>
          <p className="text-gray-400 mt-1">การเรียนรู้ที่ปรับแต่งเฉพาะคุณด้วย AI</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Lightbulb className="w-4 h-4 mr-2" />
          รับคำแนะนำใหม่
        </Button>
      </div>

      {/* Learning Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="text-2xl">{insight.icon}</div>
                {insight.change && (
                  <Badge variant="secondary" className="text-green-400">
                    +{insight.change}%
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{insight.title}</h3>
              <p className="text-gray-400 text-xs">{insight.description}</p>
              {insight.metric && (
                <div className="mt-2">
                  <Progress value={insight.metric} className="h-2" />
                  <span className="text-xs text-gray-400 mt-1">{insight.metric}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Paths */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                เส้นทางการเรียนรู้ที่แนะนำ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningPaths.map((path) => (
                <div key={path.id} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white">{path.title}</h3>
                        <Badge className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{path.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {path.estimatedTime}
                        </span>
                        <span>{path.courses.length} คอร์ส</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">ความคืบหน้า</span>
                      <span className="text-white">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">คอร์สในเส้นทางนี้:</h4>
                    <div className="space-y-1">
                      {path.courses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            {course.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : course.recommended ? (
                              <Star className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <div className="w-4 h-4 border border-gray-500 rounded-full" />
                            )}
                            <span className={course.completed ? 'text-gray-400 line-through' : 'text-gray-300'}>
                              {course.title}
                            </span>
                          </div>
                          {course.recommended && (
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">
                              แนะนำ
                            </Badge>
                          )}
                        </div>
                      ))}
                      {path.courses.length > 3 && (
                        <div className="text-xs text-gray-400">
                          และอีก {path.courses.length - 3} คอร์ส...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="flex flex-wrap gap-1">
                      {path.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {path.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{path.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                คำแนะนำจาก AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(rec.type)}
                      <Badge variant="outline" className="text-xs">
                        {rec.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      {rec.confidence}% แม่นยำ
                    </div>
                  </div>

                  <h4 className="font-semibold text-white text-sm mb-1">{rec.title}</h4>
                  <p className="text-gray-300 text-xs mb-2">{rec.description}</p>
                  
                  <div className="bg-gray-700/50 p-2 rounded text-xs text-gray-400 mb-2">
                    <strong>เหตุผล:</strong> {rec.reason}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {rec.estimatedTime}
                    </span>
                    <Button size="sm" className="text-xs h-7">
                      <Play className="w-3 h-3 mr-1" />
                      เริ่ม
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}