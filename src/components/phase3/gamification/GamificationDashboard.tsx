'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, Target, TrendingUp } from 'lucide-react'

interface UserProfile {
  level: number
  experience: number
  totalPoints: number
  streak: number
  badges: any[]
  achievements: any[]
}

interface LeaderboardEntry {
  rank?: number
  points: number
  profile: {
    user: { name: string }
  }
}

export default function GamificationDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGamificationData()
  }, [])

  const fetchGamificationData = async () => {
    try {
      const statusRes = await fetch('/api/phase3/gamification?action=status')
      const statusData = await statusRes.json()
      setProfile(statusData)

      const leaderRes = await fetch('/api/phase3/gamification?action=leaderboard&category=weekly&limit=10')
      const leaderData = await leaderRes.json()
      setLeaderboard(leaderData)
    } catch (error) {
      console.error('Failed to fetch gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  const experienceToNextLevel = ((profile?.level || 1) * 1000) - (profile?.experience || 0)
  const progressToNextLevel = ((profile?.experience || 0) % 1000) / 10

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Level {profile?.level || 1}</div>
              <div className="text-sm text-gray-500">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile?.totalPoints || 0}</div>
              <div className="text-sm text-gray-500">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{profile?.streak || 0}</div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profile?.achievements?.length || 0}</div>
              <div className="text-sm text-gray-500">Achievements</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {(profile?.level || 1) + 1}</span>
              <span>{experienceToNextLevel} XP needed</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Weekly Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{entry.profile?.user?.name || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">{entry.points} points</div>
                  </div>
                </div>
                {index < 3 && (
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}