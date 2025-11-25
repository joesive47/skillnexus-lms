'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Target, Play } from 'lucide-react'

interface StudySession {
  id: string
  courseId: string
  courseName: string
  startTime: string
  duration?: number
  completed: boolean
}

interface StudyPlannerProps {
  userId: string
}

export function StudyPlanner({ userId }: StudyPlannerProps) {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [activeSession, setActiveSession] = useState<StudySession | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    checkFeatureAndLoad()
  }, [userId])

  const checkFeatureAndLoad = async () => {
    try {
      const featureRes = await fetch('/api/features/advanced_features')
      const featureData = await featureRes.json()
      
      if (featureData.enabled) {
        setIsEnabled(true)
        await loadSessions()
      }
    } catch (error) {
      console.error('Failed to check feature:', error)
    }
  }

  const loadSessions = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/study-sessions`)
      const data = await res.json()
      setSessions(data.sessions || [])
      setActiveSession(data.activeSession)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const startSession = async (courseId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/study-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })

      if (res.ok) {
        const session = await res.json()
        setActiveSession(session)
        await loadSessions()
      }
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const endSession = async () => {
    if (!activeSession) return

    try {
      await fetch(`/api/study-sessions/${activeSession.id}/end`, {
        method: 'POST'
      })
      setActiveSession(null)
      await loadSessions()
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  if (!isEnabled) return null

  return (
    <div className="space-y-4">
      {/* Active Session */}
      {activeSession && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Active Study Session</CardTitle>
              </div>
              <Button variant="outline" onClick={endSession}>
                End Session
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <h4 className="font-medium">{activeSession.courseName}</h4>
                <p className="text-sm text-muted-foreground">
                  Started: {new Date(activeSession.startTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <CardTitle>Study History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No study sessions yet. Start learning to track your progress!
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 10).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{session.courseName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.startTime).toLocaleDateString()} at{' '}
                      {new Date(session.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.duration && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(session.duration)}
                      </Badge>
                    )}
                    <Badge variant={session.completed ? "default" : "secondary"}>
                      {session.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            <CardTitle>Today's Goal</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-purple-600 mb-2">30 min</div>
            <p className="text-sm text-muted-foreground">Daily study target</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">10 min completed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}