'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MapPin,
  Target,
  Clock,
  CheckCircle,
  Circle,
  Star,
  Play,
  TrendingUp,
  Calendar
} from 'lucide-react'

interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedHours: number
  progress: number
  steps: PathStep[]
}

interface PathStep {
  id: string
  title: string
  type: 'COURSE' | 'SKILL_ASSESSMENT' | 'PROJECT' | 'QUIZ'
  estimatedHours: number
  isCompleted: boolean
  isLocked: boolean
  order: number
  score?: number
}

export default function LearningPathDashboard() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const mockPaths = [
        {
          id: '1',
          title: 'Full-Stack Developer Path',
          description: 'Complete journey from frontend to backend development',
          difficulty: 'INTERMEDIATE',
          estimatedHours: 120,
          progress: 65,
          steps: [
            {
              id: 'step1',
              title: 'HTML & CSS Fundamentals',
              type: 'COURSE' as const,
              estimatedHours: 15,
              isCompleted: true,
              isLocked: false,
              order: 1,
              score: 95
            },
            {
              id: 'step2',
              title: 'JavaScript Essentials',
              type: 'COURSE' as const,
              estimatedHours: 25,
              isCompleted: true,
              isLocked: false,
              order: 2,
              score: 88
            },
            {
              id: 'step3',
              title: 'React Development',
              type: 'COURSE' as const,
              estimatedHours: 30,
              isCompleted: false,
              isLocked: false,
              order: 3
            }
          ]
        }
      ]
      setPaths(mockPaths)
      setSelectedPath(mockPaths[0])
      setLoading(false)
    }, 1000)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      BEGINNER: 'bg-green-500',
      INTERMEDIATE: 'bg-yellow-500',
      ADVANCED: 'bg-orange-500',
      EXPERT: 'bg-red-500'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500'
  }

  const getStepIcon = (step: PathStep) => {
    if (step.isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (step.isLocked) return <Circle className="w-5 h-5 text-gray-400" />
    return <Play className="w-5 h-5 text-blue-500" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <MapPin className="w-8 h-8 mr-3" />
            Learning Paths
          </h1>
          <p className="text-gray-300">Your personalized journey to career success</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  My Learning Paths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paths.map((path) => (
                  <div
                    key={path.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPath?.id === path.id
                        ? 'bg-purple-600/30 border border-purple-500'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                    onClick={() => setSelectedPath(path)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium text-sm">{path.title}</h3>
                      <Badge className={`${getDifficultyColor(path.difficulty)} text-white text-xs`}>
                        {path.difficulty}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={path.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{path.progress}% Complete</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {path.estimatedHours}h
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedPath && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl mb-2">
                    {selectedPath.title}
                  </CardTitle>
                  <p className="text-gray-300 text-sm">
                    {selectedPath.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="steps" className="space-y-4">
                    <TabsList className="bg-gray-800 border-gray-700">
                      <TabsTrigger value="steps" className="data-[state=active]:bg-purple-600">
                        Learning Steps
                      </TabsTrigger>
                      <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">
                        Progress
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="steps" className="space-y-4">
                      <div className="space-y-3">
                        {selectedPath.steps.map((step) => (
                          <div
                            key={step.id}
                            className={`flex items-center p-4 rounded-lg border ${
                              step.isCompleted
                                ? 'bg-green-500/10 border-green-500/20'
                                : step.isLocked
                                ? 'bg-gray-500/10 border-gray-500/20'
                                : 'bg-blue-500/10 border-blue-500/20'
                            }`}
                          >
                            <div className="flex items-center mr-4">
                              {getStepIcon(step)}
                              <span className="ml-2 text-gray-400 text-sm">
                                {step.order}
                              </span>
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{step.title}</h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {step.type}
                                </Badge>
                                <span className="text-gray-400 text-xs flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {step.estimatedHours}h
                                </span>
                                {step.score && (
                                  <span className="text-green-400 text-xs flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    {step.score}%
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {!step.isLocked && !step.isCompleted && (
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  Continue
                                </Button>
                              )}
                              {step.isCompleted && (
                                <Button size="sm" variant="outline">
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="progress" className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-green-300 text-sm">Completed</p>
                              <p className="text-white text-2xl font-bold">
                                {selectedPath.steps.filter(s => s.isCompleted).length}
                              </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-blue-300 text-sm">In Progress</p>
                              <p className="text-white text-2xl font-bold">
                                {selectedPath.steps.filter(s => !s.isCompleted && !s.isLocked).length}
                              </p>
                            </div>
                            <Play className="w-8 h-8 text-blue-500" />
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-purple-300 text-sm">Remaining</p>
                              <p className="text-white text-2xl font-bold">
                                {selectedPath.steps.filter(s => s.isLocked).length}
                              </p>
                            </div>
                            <Circle className="w-8 h-8 text-purple-500" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">Overall Progress</span>
                          <span className="text-gray-300">{selectedPath.progress}%</span>
                        </div>
                        <Progress value={selectedPath.progress} className="h-3" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}