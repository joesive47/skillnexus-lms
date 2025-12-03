'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Clock, Target, Brain } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface LearningInsight {
  totalStudyTime: number
  averageSessionTime: number
  preferredLearningTime: string
  strongestSkills: string[]
  learningStreak: number
  completionRate: number
  weeklyProgress: Array<{ day: string; minutes: number }>
  skillDistribution: Array<{ skill: string; value: number }>
}

interface LearningInsightsProps {
  userId: string
}

export function LearningInsights({ userId }: LearningInsightsProps) {
  const [insights, setInsights] = useState<LearningInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    checkFeatureAndLoad()
  }, [userId])

  const checkFeatureAndLoad = async () => {
    try {
      const featureRes = await fetch('/api/features/ai_recommendations')
      const featureData = await featureRes.json()
      
      if (featureData.enabled) {
        setIsEnabled(true)
        await loadInsights()
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const loadInsights = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/insights`)
      const data = await res.json()
      setInsights(data.insights)
    } catch (error) {
      console.error('Failed to load insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isEnabled) return null
  if (loading) return <div className="p-4">Analyzing your learning...</div>
  if (!insights) return null

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <CardTitle>Your Learning Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(insights.totalStudyTime / 60)}h
              </div>
              <div className="text-sm text-muted-foreground">Total Study Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {insights.averageSessionTime}m
              </div>
              <div className="text-sm text-muted-foreground">Avg Session</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {insights.learningStreak}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {insights.completionRate}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Progress */}
            <div>
              <h4 className="font-medium mb-3">Weekly Learning Activity</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={insights.weeklyProgress}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Bar dataKey="minutes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Skill Distribution */}
            <div>
              <h4 className="font-medium mb-3">Learning Focus Areas</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={insights.skillDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    nameKey="skill"
                  >
                    {insights.skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Your Learning Profile</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Best Learning Time:</span>
                <Badge variant="outline">{insights.preferredLearningTime}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Strongest Skills:</span>
                <div className="flex gap-1">
                  {insights.strongestSkills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}