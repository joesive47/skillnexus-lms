'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, AlertTriangle, Target, Brain, BarChart3 } from 'lucide-react'

interface PredictiveInsight {
  type: 'success_probability' | 'completion_time' | 'risk_assessment' | 'skill_gap'
  title: string
  value: string | number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  recommendation: string
}

interface LearningPrediction {
  userId: string
  courseId: string
  insights: PredictiveInsight[]
  overallScore: number
  riskLevel: 'low' | 'medium' | 'high'
}

export default function PredictiveAnalytics({ userId, courseId }: { userId: string; courseId?: string }) {
  const [predictions, setPredictions] = useState<LearningPrediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
  }, [userId, courseId])

  const fetchPredictions = async () => {
    try {
      const url = courseId 
        ? `/api/analytics/predictions/${userId}?courseId=${courseId}`
        : `/api/analytics/predictions/${userId}`
      
      const response = await fetch(url)
      const data = await response.json()
      setPredictions(data)
    } catch (error) {
      console.error('Failed to fetch predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading predictive analytics...</div>
  }

  if (!predictions) {
    return <div>No prediction data available</div>
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Learning Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{predictions.overallScore}%</div>
                <div className="text-sm text-gray-600">Success Probability</div>
              </div>
              <Badge className={getRiskColor(predictions.riskLevel)}>
                {predictions.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
            <Progress value={predictions.overallScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        {predictions.insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {insight.type === 'success_probability' && <Target className="h-4 w-4" />}
                {insight.type === 'completion_time' && <BarChart3 className="h-4 w-4" />}
                {insight.type === 'risk_assessment' && <AlertTriangle className="h-4 w-4" />}
                {insight.type === 'skill_gap' && <Brain className="h-4 w-4" />}
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-semibold">{insight.value}</div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(insight.trend)}
                    <span className="text-sm text-gray-600">{insight.confidence}% confidence</span>
                  </div>
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <strong>Recommendation:</strong> {insight.recommendation}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Path Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Optimized Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="font-medium text-blue-900">Next Recommended Action</div>
              <div className="text-blue-700 mt-1">
                Focus on foundational concepts before advancing to complex topics
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="font-medium text-green-900">Strength Area</div>
              <div className="text-green-700 mt-1">
                Strong performance in practical exercises - continue hands-on learning
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="font-medium text-yellow-900">Improvement Opportunity</div>
              <div className="text-yellow-700 mt-1">
                Consider additional practice in theoretical concepts
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}