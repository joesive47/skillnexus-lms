'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target, BookOpen, Trophy, Zap, Gift, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface Mission {
  id: string
  title: string
  description: string
  type: string
  target: number
  xpReward: number
  creditReward: number
  progress: number
  completed: boolean
}

export default function DailyMissions({ userId }: { userId: string }) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMissions()
  }, [userId])

  const loadMissions = async () => {
    try {
      const response = await fetch(`/api/missions/daily/${userId}`)
      const data = await response.json()
      setMissions(data.missions || [])
    } catch (error) {
      console.error('Failed to load missions:', error)
    } finally {
      setLoading(false)
    }
  }

  const claimReward = async (missionId: string) => {
    try {
      const response = await fetch(`/api/missions/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, userId })
      })
      
      if (response.ok) {
        loadMissions() // Refresh missions
      }
    } catch (error) {
      console.error('Failed to claim reward:', error)
    }
  }

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'lesson_complete': return <BookOpen className="w-5 h-5" />
      case 'quiz_pass': return <Trophy className="w-5 h-5" />
      case 'login': return <Target className="w-5 h-5" />
      default: return <Zap className="w-5 h-5" />
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading missions...</div>
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-600" />
          🎯 Daily Missions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missions.map((mission) => (
            <motion.div
              key={mission.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                mission.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-purple-200'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    mission.completed ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {mission.completed ? <CheckCircle className="w-5 h-5" /> : getMissionIcon(mission.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{mission.title}</h3>
                    <p className="text-sm text-gray-600">{mission.description}</p>
                  </div>
                </div>
                
                {mission.completed ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Gift className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                ) : (
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {mission.progress}/{mission.target}
                    </div>
                  </div>
                )}
              </div>

              {!mission.completed && (
                <div className="mb-3">
                  <Progress 
                    value={(mission.progress / mission.target) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Zap className="w-4 h-4" />
                    +{mission.xpReward} XP
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Gift className="w-4 h-4" />
                    +{mission.creditReward} Credits
                  </div>
                </div>

                {mission.completed && (
                  <Button 
                    size="sm" 
                    onClick={() => claimReward(mission.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Claim Reward
                  </Button>
                )}
              </div>
            </motion.div>
          ))}

          {missions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No missions available today</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}