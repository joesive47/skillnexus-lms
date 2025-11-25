'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  Flame,
  BarChart3,
  CheckCircle,
  Play,
  BookOpen
} from 'lucide-react'

interface LearningStats {
  totalHours: number
  completedPaths: number
  activePaths: number
  currentStreak: number
  longestStreak: number
  avgScore: number
  skillsLearned: number
  certificatesEarned: number
}

interface PathProgress {
  id: string
  title: string
  progress: number
  estimatedHours: number
  timeSpent: number
  lastAccessed: string
  nextStep: string
  difficulty: string
}

export default function ProgressDashboard() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [pathProgress, setPathProgress] = useState<PathProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgressData()
  }, [])

  const fetchProgressData = async () => {
    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalHours: 127,
          completedPaths: 3,
          activePaths: 2,
          currentStreak: 7,
          longestStreak: 15,
          avgScore: 87.5,
          skillsLearned: 12,
          certificatesEarned: 3
        })

        setPathProgress([
          {
            id: '1',
            title: 'Full-Stack Developer Journey',
            progress: 65,
            estimatedHours: 120,
            timeSpent: 78,
            lastAccessed: '2024-01-15',
            nextStep: 'React Advanced Concepts',
            difficulty: 'INTERMEDIATE'
          },
          {
            id: '2',
            title: 'Data Science Fundamentals',
            progress: 25,
            estimatedHours: 80,
            timeSpent: 20,
            lastAccessed: '2024-01-10',
            nextStep: 'Statistics Basics',
            difficulty: 'BEGINNER'
          }
        ])

        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching progress data:', error)
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      BEGINNER: 'bg-green-500',
      INTERMEDIATE: 'bg-yellow-500',
      ADVANCED: 'bg-orange-500',
      EXPERT: 'bg-red-500'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Hours</p>
                <p className="text-white text-2xl font-bold">{stats?.totalHours}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Completed</p>
                <p className="text-white text-2xl font-bold">{stats?.completedPaths}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm">Current Streak</p>
                <p className="text-white text-2xl font-bold">{stats?.currentStreak}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Avg Score</p>
                <p className="text-white text-2xl font-bold">{stats?.avgScore}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">
            Learning Progress
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          {/* Active Paths */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Active Learning Paths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pathProgress.map((path) => (
                <div key={path.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{path.title}</h4>
                      <p className="text-gray-400 text-sm">Next: {path.nextStep}</p>
                    </div>
                    <Badge className={`${getDifficultyColor(path.difficulty)} text-white`}>
                      {path.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{path.timeSpent}h / {path.estimatedHours}h</span>
                      <span>Last accessed: {formatDate(path.lastAccessed)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Continue Learning
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Learning Streaks */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Flame className="w-5 h-5 mr-2" />
                  Learning Streaks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Current Streak</span>
                  <div className="flex items-center text-orange-400">
                    <Flame className="w-4 h-4 mr-1" />
                    <span className="font-bold">{stats?.currentStreak} days</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Longest Streak</span>
                  <span className="text-white font-bold">{stats?.longestStreak} days</span>
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 border border-orange-500/30">
                  <p className="text-orange-300 text-sm">
                    🔥 You're on fire! Keep learning to maintain your streak.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Certificates Earned
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {stats?.certificatesEarned}
                  </div>
                  <p className="text-gray-300">Certificates Earned</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">JavaScript Fundamentals</span>
                    <Badge className="bg-yellow-500 text-black">Certified</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">React Development</span>
                    <Badge className="bg-yellow-500 text-black">Certified</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Node.js Backend</span>
                    <Badge className="bg-yellow-500 text-black">Certified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Learning Velocity */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Learning Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Learning Velocity</span>
                    <span className="text-green-400 font-bold">+15% above average</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Skills Mastered</span>
                    <span className="text-white font-bold">{stats?.skillsLearned}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Average Score</span>
                    <span className="text-white font-bold">{stats?.avgScore}%</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    📈 You're learning 15% faster than average students!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const hours = [2, 1.5, 3, 2.5, 1, 0.5, 1][index]
                    const maxHours = 3
                    const percentage = (hours / maxHours) * 100
                    
                    return (
                      <div key={day} className="flex items-center space-x-3">
                        <span className="text-gray-300 text-sm w-8">{day}</span>
                        <div className="flex-1">
                          <div className="bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-white text-sm w-8">{hours}h</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}