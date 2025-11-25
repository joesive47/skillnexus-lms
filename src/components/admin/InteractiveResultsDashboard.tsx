'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart3, Users, Trophy, Clock } from 'lucide-react'

interface InteractiveResult {
  id: string
  score: number
  passed: boolean
  completedAt: string
  user: {
    name: string
    email: string
  }
  lesson: {
    title: string
  }
}

interface InteractiveResultsDashboardProps {
  courseId?: string
  lessonId?: string
}

export default function InteractiveResultsDashboard({ 
  courseId, 
  lessonId 
}: InteractiveResultsDashboardProps) {
  const [results, setResults] = useState<InteractiveResult[]>([])
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    passRate: 0,
    totalUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [courseId, lessonId])

  const fetchResults = async () => {
    try {
      const params = new URLSearchParams()
      if (courseId) params.append('courseId', courseId)
      if (lessonId) params.append('lessonId', lessonId)

      const response = await fetch(`/api/interactive/results?${params}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
        calculateStats(data.results)
      }
    } catch (error) {
      console.error('Failed to fetch results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (results: InteractiveResult[]) => {
    const totalAttempts = results.length
    const passedResults = results.filter(r => r.passed)
    const totalScore = results.reduce((sum, r) => sum + r.score, 0)
    const uniqueUsers = new Set(results.map(r => r.user.email)).size

    setStats({
      totalAttempts,
      averageScore: totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0,
      passRate: totalAttempts > 0 ? Math.round((passedResults.length / totalAttempts) * 100) : 0,
      totalUsers: uniqueUsers
    })
  }

  if (isLoading) {
    return <div className="p-4">กำลังโหลด...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">ผู้เรียน</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">คะแนนเฉลี่ย</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">อัตราผ่าน</p>
                <p className="text-2xl font-bold">{stats.passRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">ครั้งทั้งหมด</p>
                <p className="text-2xl font-bold">{stats.totalAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>ผลการเรียนรู้แบบ Interactive</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              ยังไม่มีผลการเรียนรู้
            </p>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{result.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.user.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.lesson.title}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">{result.score}%</p>
                      <Progress 
                        value={result.score} 
                        className="w-20 h-2"
                      />
                    </div>

                    <Badge
                      variant={result.passed ? 'default' : 'destructive'}
                    >
                      {result.passed ? 'ผ่าน' : 'ไม่ผ่าน'}
                    </Badge>

                    <div className="text-sm text-muted-foreground">
                      {new Date(result.completedAt).toLocaleDateString('th-TH')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}