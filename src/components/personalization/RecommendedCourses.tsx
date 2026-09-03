'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CourseCard } from '@/components/course/course-card'
import { Sparkles, RefreshCw } from 'lucide-react'

interface Recommendation {
  id: string
  courseId: string
  score: number
  reason: string
  type: string
  course: {
    id: string
    title: string
    description: string
    price: number
    imageUrl: string
    _count: { lessons: number; enrollments: number }
  }
}

interface RecommendedCoursesProps {
  userId: string
}

export function RecommendedCourses({ userId }: RecommendedCoursesProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
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
        await loadRecommendations()
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to check feature:', error)
      setLoading(false)
    }
  }

  const loadRecommendations = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/recommendations`)
      const data = await res.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshRecommendations = async () => {
    setLoading(true)
    try {
      await fetch(`/api/users/${userId}/recommendations`, { method: 'POST' })
      await loadRecommendations()
    } catch (error) {
      console.error('Failed to refresh recommendations:', error)
      setLoading(false)
    }
  }

  if (!isEnabled) return null
  if (loading) return <div className="p-4">Loading recommendations...</div>

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <CardTitle>Recommended for You</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshRecommendations}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No recommendations yet. Complete more courses to get personalized suggestions!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 6).map((rec) => (
              <div key={rec.id} className="space-y-2">
                <CourseCard 
                  course={{ ...rec.course, published: true }}
                  userRole="STUDENT"
                />
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="secondary" className="text-xs">
                    {rec.type === 'similar' && '🎯 Similar'}
                    {rec.type === 'popular' && '🔥 Popular'}
                    {rec.type === 'skill-based' && '📚 Skill-based'}
                    {rec.type === 'ai' && '🤖 AI Pick'}
                  </Badge>
                  <span className="text-muted-foreground">
                    {Math.round(rec.score * 100)}% match
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {rec.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}