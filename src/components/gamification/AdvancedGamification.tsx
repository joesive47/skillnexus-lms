'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  Crown, 
  Flame,
  TrendingUp,
  Users,
  Calendar,
  Gift,
  Medal,
  Sparkles
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: Date
  reward: {
    xp: number
    coins: number
    badge?: string
  }
}

interface Quest {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  progress: number
  maxProgress: number
  reward: {
    xp: number
    coins: number
    items?: string[]
  }
  expiresAt: Date
  completed: boolean
}

interface UserStats {
  level: number
  xp: number
  xpToNext: number
  totalXp: number
  coins: number
  streak: number
  rank: number
  totalUsers: number
  achievements: number
  completedQuests: number
}

export default function AdvancedGamification() {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 15,
    xp: 2450,
    xpToNext: 550,
    totalXp: 12450,
    coins: 1250,
    streak: 7,
    rank: 42,
    totalUsers: 12547,
    achievements: 23,
    completedQuests: 156
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'จบบทเรียนแรก',
      icon: '🎯',
      rarity: 'common',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      reward: { xp: 100, coins: 50 }
    },
    {
      id: '2',
      title: 'Speed Learner',
      description: 'จบ 5 บทเรียนในวันเดียว',
      icon: '⚡',
      rarity: 'rare',
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      reward: { xp: 500, coins: 200, badge: 'speed-demon' }
    },
    {
      id: '3',
      title: 'Master Student',
      description: 'ได้คะแนนเต็มในแบบทดสอบ 10 ครั้ง',
      icon: '🏆',
      rarity: 'epic',
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      reward: { xp: 1000, coins: 500, badge: 'perfectionist' }
    },
    {
      id: '4',
      title: 'Legend',
      description: 'อยู่ในอันดับ Top 10',
      icon: '👑',
      rarity: 'legendary',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      reward: { xp: 2000, coins: 1000, badge: 'legend' }
    }
  ])

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Daily Grind',
      description: 'จบ 3 บทเรียนวันนี้',
      type: 'daily',
      progress: 2,
      maxProgress: 3,
      reward: { xp: 200, coins: 100 },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '2',
      title: 'Quiz Master',
      description: 'ทำแบบทดสอบ 5 ข้อให้ได้คะแนนเต็ม',
      type: 'weekly',
      progress: 3,
      maxProgress: 5,
      reward: { xp: 500, coins: 250, items: ['bonus-xp-potion'] },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '3',
      title: 'Streak Keeper',
      description: 'เรียนต่อเนื่อง 30 วัน',
      type: 'monthly',
      progress: 7,
      maxProgress: 30,
      reward: { xp: 1500, coins: 750, items: ['golden-certificate'] },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      completed: false
    }
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400'
      case 'rare': return 'text-blue-400 border-blue-400'
      case 'epic': return 'text-purple-400 border-purple-400'
      case 'legendary': return 'text-yellow-400 border-yellow-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-600'
      case 'weekly': return 'bg-blue-600'
      case 'monthly': return 'bg-purple-600'
      case 'special': return 'bg-yellow-600'
      default: return 'bg-gray-600'
    }
  }

  const levelProgress = (userStats.xp / (userStats.xp + userStats.xpToNext)) * 100

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gamification Hub</h1>
          <p className="text-gray-400 mt-1">ระบบรางวัลและความสำเร็จ</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-yellow-600/20 px-3 py-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{userStats.coins}</span>
          </div>
          <div className="flex items-center space-x-2 bg-orange-600/20 px-3 py-2 rounded-lg">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-semibold">{userStats.streak} วัน</span>
          </div>
        </div>
      </div>

      {/* User Level & Progress */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Level {userStats.level}</h2>
                <p className="text-gray-300">อันดับ #{userStats.rank} จาก {userStats.totalUsers.toLocaleString()} คน</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{userStats.xp.toLocaleString()} XP</div>
              <div className="text-gray-300">ต้องการอีก {userStats.xpToNext.toLocaleString()} XP</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>ความคืบหน้า Level {userStats.level + 1}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              ความสำเร็จ ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? `bg-gradient-to-r from-gray-700/50 to-gray-600/50 ${getRarityColor(achievement.rarity)}`
                    : 'bg-gray-700/30 border-gray-600 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{achievement.title}</h3>
                      <p className="text-gray-300 text-sm">{achievement.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity.toUpperCase()}
                        </Badge>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <span className="text-xs text-gray-400">
                            ปลดล็อกเมื่อ {achievement.unlockedAt.toLocaleDateString('th-TH')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      {achievement.progress}/{achievement.maxProgress}
                    </div>
                    {!achievement.unlocked && (
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="w-20 h-2 mt-1"
                      />
                    )}
                  </div>
                </div>
                
                {achievement.unlocked && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-400">+{achievement.reward.xp} XP</span>
                      <span className="text-yellow-400">+{achievement.reward.coins} Coins</span>
                      {achievement.reward.badge && (
                        <Badge variant="outline" className="text-purple-400 border-purple-400">
                          Badge: {achievement.reward.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quests */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-400" />
              ภารกิจ ({quests.filter(q => q.completed).length}/{quests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`p-4 rounded-lg border transition-all ${
                  quest.completed
                    ? 'bg-green-600/20 border-green-500'
                    : 'bg-gray-700/50 border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white">{quest.title}</h3>
                      <Badge className={getQuestTypeColor(quest.type)}>
                        {quest.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm">{quest.description}</p>
                  </div>
                  {quest.completed && (
                    <div className="text-green-400">
                      <Award className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>ความคืบหน้า</span>
                    <span>{quest.progress}/{quest.maxProgress}</span>
                  </div>
                  <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-blue-400">+{quest.reward.xp} XP</span>
                    <span className="text-yellow-400">+{quest.reward.coins} Coins</span>
                    {quest.reward.items && quest.reward.items.length > 0 && (
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        +{quest.reward.items.length} Items
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {Math.ceil((quest.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} วัน
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Preview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
              กระดานคะแนน
            </div>
            <Button variant="outline" size="sm">
              ดูทั้งหมด
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'นายสมชาย ใจดี', xp: 15420, level: 18 },
              { rank: 2, name: 'นางสาวมาลี สวยงาม', xp: 14890, level: 17 },
              { rank: 3, name: 'นายวิชัย เก่งมาก', xp: 13560, level: 16 },
              { rank: 42, name: 'คุณ (ตัวคุณเอง)', xp: userStats.totalXp, level: userStats.level }
            ].map((user, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.rank <= 3 ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20' :
                  user.name.includes('คุณ') ? 'bg-purple-600/20 border border-purple-500' :
                  'bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    user.rank === 1 ? 'bg-yellow-500 text-black' :
                    user.rank === 2 ? 'bg-gray-400 text-black' :
                    user.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {user.rank <= 3 ? (
                      user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                    ) : (
                      user.rank
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">Level {user.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{user.xp.toLocaleString()} XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}