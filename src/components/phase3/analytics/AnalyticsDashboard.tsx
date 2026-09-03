'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Clock, Target, TrendingUp, Users, BookOpen } from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalSessions: number
    totalTimeMinutes: number
    avgEngagement: number
    avgCompletion: number
  }
  patterns: {
    timeOfDay: { [key: string]: number }
    dayOfWeek: { [key: string]: number }
    deviceUsage: { [key: string]: number }
  }
  learningTrends: Array<{
    date: string
    sessions: number
    avgTime: number
    avgEngagement: number
    avgCompletion: number
  }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/phase3/analytics?type=user&period=${period}`)
      const data = await res.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const hourNames = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Analytics</h2>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <p className="text-2xl font-bold">{analytics?.summary.totalSessions || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Study Time</p>
                <p className="text-2xl font-bold">{analytics?.summary.totalTimeMinutes || 0}m</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Engagement</p>
                <p className="text-2xl font-bold">{Math.round((analytics?.summary.avgEngagement || 0) * 100)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round((analytics?.summary.avgCompletion || 0) * 100)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning by Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics?.patterns.dayOfWeek || {}).map(([day, count]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm">{dayNames[parseInt(day)] || `Day ${day}`}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(analytics?.patterns.dayOfWeek || {}))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics?.patterns.deviceUsage || {}).map(([device, count]) => (
                <div key={device} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{device}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(analytics?.patterns.deviceUsage || {}))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.learningTrends?.slice(-7).map((trend, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium">{new Date(trend.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Sessions</div>
                  <div className="font-medium">{trend.sessions}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Avg Time</div>
                  <div className="font-medium">{trend.avgTime}m</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Engagement</div>
                  <div className="font-medium">{Math.round(trend.avgEngagement * 100)}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Completion</div>
                  <div className="font-medium">{Math.round(trend.avgCompletion * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}