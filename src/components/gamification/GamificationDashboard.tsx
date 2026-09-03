'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, Target, Zap, Award, Crown } from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

interface UserStats {
  level: number
  xp: number
  xpToNext: number
  totalXP: number
  streak: number
  achievements: Achievement[]
  badges: string[]
  leaderboardRank: number
}

export default function GamificationDashboard({ userId }: { userId: string }) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserStats()
  }, [userId])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/gamification/stats/${userId}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading gamification data...</div>
  }

  if (!stats) {
    return <div>Failed to load gamification data</div>
  }

  const levelProgress = (stats.xp / stats.xpToNext) * 100

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6" />
            Level {stats.level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{stats.xp} XP</span>
                <span>{stats.xpToNext} XP to next level</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.totalXP}</div>
                <div className="text-sm opacity-90">Total XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold">#{stats.leaderboardRank}</div>
                <div className="text-sm opacity-90">Rank</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements ({stats.achievements.filter(a => a.unlocked).length}/{stats.achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="font-medium text-sm">{achievement.name}</div>
                  <div className="text-xs text-gray-600">{achievement.description}</div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Badges Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((badge, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {badge}
              </Badge>
            ))}
            {stats.badges.length === 0 && (
              <p className="text-gray-500">No badges earned yet. Keep learning to unlock badges!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Complete 1 Lesson</div>
                  <div className="text-sm text-gray-600">Earn 50 XP</div>
                </div>
              </div>
              <Badge variant="secondary">+50 XP</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Pass a Quiz</div>
                  <div className="text-sm text-gray-600">Score 80% or higher</div>
                </div>
              </div>
              <Badge variant="secondary">+100 XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}