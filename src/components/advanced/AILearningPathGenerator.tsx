'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Brain, 
  Target, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Star,
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Users,
  Award,
  Play,
  Shuffle,
  Settings,
  Filter
} from 'lucide-react'

interface LearningGoal {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  prerequisites: string[]
  skills: string[]
}

interface GeneratedPath {
  id: string
  title: string
  description: string
  totalDuration: string
  difficulty: string
  confidence: number
  phases: {
    id: string
    title: string
    description: string
    duration: string
    courses: {
      id: string
      title: string
      type: 'video' | 'interactive' | 'project' | 'quiz'
      duration: string
      difficulty: string
      prerequisites: string[]
    }[]
    skills: string[]
    milestones: string[]
  }[]
  adaptiveFeatures: {
    personalizedContent: boolean
    difficultyAdjustment: boolean
    paceOptimization: boolean
    skillGapAnalysis: boolean
  }
}

interface UserProfile {
  currentSkills: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  availableTime: string
  experience: 'beginner' | 'intermediate' | 'advanced'
  preferences: {
    contentTypes: string[]
    pacing: 'slow' | 'medium' | 'fast'
    interactivity: 'low' | 'medium' | 'high'
  }
}

export default function AILearningPathGenerator() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    currentSkills: ['JavaScript', 'HTML', 'CSS'],
    learningStyle: 'mixed',
    availableTime: '10-15 hours/week',
    experience: 'intermediate',
    preferences: {
      contentTypes: ['video', 'interactive', 'project'],
      pacing: 'medium',
      interactivity: 'high'
    }
  })

  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([])
  const [selectedGoal, setSelectedGoal] = useState<string>('')
  const [customGoal, setCustomGoal] = useState('')
  const [generatedPaths, setGeneratedPaths] = useState<GeneratedPath[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  useEffect(() => {
    // Load available learning goals
    setLearningGoals([
      {
        id: '1',
        title: 'Full-Stack Web Developer',
        description: 'เรียนรู้การพัฒนาเว็บแบบครบวงจร',
        category: 'Web Development',
        difficulty: 'intermediate',
        estimatedTime: '6-8 เดือน',
        prerequisites: ['HTML', 'CSS', 'JavaScript'],
        skills: ['React', 'Node.js', 'Database', 'API', 'DevOps']
      },
      {
        id: '2',
        title: 'Data Scientist',
        description: 'เชี่ยวชาญด้านการวิเคราะห์ข้อมูลและ AI',
        category: 'Data Science',
        difficulty: 'advanced',
        estimatedTime: '8-12 เดือน',
        prerequisites: ['Python', 'Statistics', 'Mathematics'],
        skills: ['Machine Learning', 'Deep Learning', 'Data Visualization', 'Big Data']
      },
      {
        id: '3',
        title: 'Mobile App Developer',
        description: 'พัฒนาแอปพลิเคชันมือถือ',
        category: 'Mobile Development',
        difficulty: 'intermediate',
        estimatedTime: '4-6 เดือน',
        prerequisites: ['Programming Basics'],
        skills: ['React Native', 'Flutter', 'iOS', 'Android', 'UI/UX']
      },
      {
        id: '4',
        title: 'Cloud Solutions Architect',
        description: 'ออกแบบและจัดการระบบ Cloud',
        category: 'Cloud Computing',
        difficulty: 'advanced',
        estimatedTime: '6-10 เดือน',
        prerequisites: ['System Administration', 'Networking'],
        skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps']
      }
    ])
  }, [])

  const generateLearningPath = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const selectedGoalData = learningGoals.find(g => g.id === selectedGoal)
    
    if (selectedGoalData) {
      const generatedPath: GeneratedPath = {
        id: `path_${Date.now()}`,
        title: `เส้นทางการเรียนรู้: ${selectedGoalData.title}`,
        description: `เส้นทางที่ปรับแต่งเฉพาะสำหรับคุณ โดยพิจารณาจากทักษะปัจจุบัน รูปแบบการเรียนรู้ และเป้าหมาย`,
        totalDuration: selectedGoalData.estimatedTime,
        difficulty: selectedGoalData.difficulty,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        phases: [
          {
            id: 'phase1',
            title: 'Foundation Phase',
            description: 'สร้างพื้นฐานที่แข็งแกร่ง',
            duration: '4-6 สัปดาห์',
            courses: [
              {
                id: 'course1',
                title: 'Advanced JavaScript Concepts',
                type: 'video',
                duration: '8 ชั่วโมง',
                difficulty: 'intermediate',
                prerequisites: ['JavaScript Basics']
              },
              {
                id: 'course2',
                title: 'Modern CSS & Responsive Design',
                type: 'interactive',
                duration: '6 ชั่วโมง',
                difficulty: 'intermediate',
                prerequisites: ['CSS Basics']
              }
            ],
            skills: ['ES6+', 'Async/Await', 'Flexbox', 'Grid'],
            milestones: ['Complete JavaScript assessment', 'Build responsive portfolio']
          },
          {
            id: 'phase2',
            title: 'Framework Mastery',
            description: 'เรียนรู้ Framework สมัยใหม่',
            duration: '6-8 สัปดาห์',
            courses: [
              {
                id: 'course3',
                title: 'React Development Masterclass',
                type: 'project',
                duration: '20 ชั่วโมง',
                difficulty: 'intermediate',
                prerequisites: ['JavaScript', 'HTML', 'CSS']
              },
              {
                id: 'course4',
                title: 'State Management with Redux',
                type: 'interactive',
                duration: '8 ชั่วโมง',
                difficulty: 'intermediate',
                prerequisites: ['React Basics']
              }
            ],
            skills: ['React', 'Redux', 'Component Design', 'Hooks'],
            milestones: ['Build 3 React projects', 'Master state management']
          },
          {
            id: 'phase3',
            title: 'Backend Integration',
            description: 'เชื่อมต่อ Frontend กับ Backend',
            duration: '8-10 สัปดาห์',
            courses: [
              {
                id: 'course5',
                title: 'Node.js & Express Framework',
                type: 'project',
                duration: '15 ชั่วโมง',
                difficulty: 'intermediate',
                prerequisites: ['JavaScript', 'HTTP Basics']
              },
              {
                id: 'course6',
                title: 'Database Design & MongoDB',
                type: 'interactive',
                duration: '12 ชั่วโมง',
                difficulty: 'intermediate',
                prerequisites: ['Database Concepts']
              }
            ],
            skills: ['Node.js', 'Express', 'MongoDB', 'API Design'],
            milestones: ['Build REST API', 'Deploy full-stack app']
          }
        ],
        adaptiveFeatures: {
          personalizedContent: true,
          difficultyAdjustment: true,
          paceOptimization: true,
          skillGapAnalysis: true
        }
      }
      
      setGeneratedPaths([generatedPath])
    }
    
    setIsGenerating(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600'
      case 'intermediate': return 'bg-yellow-600'
      case 'advanced': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />
      case 'interactive': return <Zap className="w-4 h-4" />
      case 'project': return <Target className="w-4 h-4" />
      case 'quiz': return <BarChart3 className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-400" />
            AI Learning Path Generator
          </h1>
          <p className="text-gray-400 mt-1">สร้างเส้นทางการเรียนรู้ที่ปรับแต่งเฉพาะคุณด้วย AI</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          <Settings className="w-4 h-4 mr-2" />
          ตั้งค่าขั้นสูง
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Selection & Profile */}
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                เลือกเป้าหมายการเรียนรู้
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {learningGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedGoal === goal.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedGoal(goal.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm">{goal.title}</h4>
                      <Badge className={getDifficultyColor(goal.difficulty)}>
                        {goal.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-xs mb-2">{goal.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {goal.estimatedTime}
                      </span>
                      <span>{goal.category}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-600">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  หรือระบุเป้าหมายของคุณเอง
                </label>
                <Textarea
                  placeholder="เช่น ฉันต้องการเรียนรู้การพัฒนา AI Chatbot..."
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Profile */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                โปรไฟล์การเรียนรู้
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">ทักษะปัจจุบัน</label>
                <div className="flex flex-wrap gap-1">
                  {userProfile.currentSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">เวลาที่มี</label>
                <Badge variant="outline">{userProfile.availableTime}</Badge>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">ระดับประสบการณ์</label>
                <Badge className={getDifficultyColor(userProfile.experience)}>
                  {userProfile.experience}
                </Badge>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">รูปแบบการเรียน</label>
                <Badge variant="outline">{userProfile.learningStyle}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Paths */}
        <div className="lg:col-span-2 space-y-4">
          {generatedPaths.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <div className="space-y-2">
                      <p className="text-white font-semibold">AI กำลังสร้างเส้นทางการเรียนรู้...</p>
                      <p className="text-gray-400 text-sm">กำลังวิเคราะห์โปรไฟล์และเป้าหมายของคุณ</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto opacity-50" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        เริ่มต้นสร้างเส้นทางการเรียนรู้
                      </h3>
                      <p className="text-gray-400 mb-4">
                        เลือกเป้าหมายการเรียนรู้แล้วกดปุ่มสร้างเส้นทาง
                      </p>
                      <Button
                        onClick={generateLearningPath}
                        disabled={!selectedGoal && !customGoal}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        สร้างเส้นทางด้วย AI
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            generatedPaths.map((path) => (
              <Card key={path.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white flex items-center mb-2">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                        {path.title}
                      </CardTitle>
                      <p className="text-gray-300 text-sm">{path.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {path.confidence}% แม่นยำ
                      </Badge>
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Path Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{path.totalDuration}</div>
                      <div className="text-xs text-gray-400">ระยะเวลารวม</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{path.phases.length}</div>
                      <div className="text-xs text-gray-400">เฟส</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {path.phases.reduce((acc, phase) => acc + phase.courses.length, 0)}
                      </div>
                      <div className="text-xs text-gray-400">คอร์ส</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {path.phases.reduce((acc, phase) => acc + phase.skills.length, 0)}
                      </div>
                      <div className="text-xs text-gray-400">ทักษะ</div>
                    </div>
                  </div>

                  {/* Adaptive Features */}
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      คุณสมบัติ AI ขั้นสูง
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(path.adaptiveFeatures).map(([key, enabled]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <CheckCircle className={`w-4 h-4 ${enabled ? 'text-green-400' : 'text-gray-500'}`} />
                          <span className="text-sm text-gray-300">
                            {key === 'personalizedContent' && 'เนื้อหาที่ปรับแต่ง'}
                            {key === 'difficultyAdjustment' && 'ปรับระดับความยาก'}
                            {key === 'paceOptimization' && 'ปรับจังหวะการเรียน'}
                            {key === 'skillGapAnalysis' && 'วิเคราะห์ช่องว่างทักษะ'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Phases */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">เฟสการเรียนรู้</h4>
                    {path.phases.map((phase, index) => (
                      <div key={phase.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                เฟส {index + 1}
                              </Badge>
                              <h5 className="font-semibold text-white">{phase.title}</h5>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{phase.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {phase.duration}
                              </span>
                              <span>{phase.courses.length} คอร์ส</span>
                              <span>{phase.skills.length} ทักษะ</span>
                            </div>
                          </div>
                        </div>

                        {/* Courses in Phase */}
                        <div className="space-y-2 mb-3">
                          {phase.courses.map((course) => (
                            <div key={course.id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(course.type)}
                                <span className="text-sm text-gray-300">{course.title}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {course.type}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                {course.duration}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Skills & Milestones */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="text-sm font-medium text-gray-300 mb-1">ทักษะที่จะได้</h6>
                            <div className="flex flex-wrap gap-1">
                              {phase.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-300 mb-1">เป้าหมายสำคัญ</h6>
                            <div className="space-y-1">
                              {phase.milestones.map((milestone, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-xs text-gray-400">
                                  <Star className="w-3 h-3 text-yellow-400" />
                                  <span>{milestone}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Shuffle className="w-4 h-4 mr-2" />
                        สร้างใหม่
                      </Button>
                      <Button size="sm" variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        ปรับแต่ง
                      </Button>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <Play className="w-4 h-4 mr-2" />
                      เริ่มเรียนเลย
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}