// 🎯 Rewards System - Make Learning Addictive
import prisma from './prisma'
import { redis } from './redis'

export interface DailyReward {
  day: number
  xp: number
  credits?: number
  badge?: string
  special?: string
}

export interface UserStreak {
  current: number
  max: number
  lastLogin: Date
  multiplier: number
}

export class RewardsSystem {
  // 🔥 Daily Login Rewards Configuration
  static DAILY_REWARDS: DailyReward[] = [
    { day: 1, xp: 10, credits: 1 },
    { day: 2, xp: 15, credits: 1 },
    { day: 3, xp: 25, credits: 2, badge: "3-Day Warrior" },
    { day: 4, xp: 30, credits: 2 },
    { day: 5, xp: 40, credits: 3 },
    { day: 6, xp: 50, credits: 3 },
    { day: 7, xp: 100, credits: 5, badge: "Week Champion", special: "2x XP Multiplier" },
    { day: 14, xp: 200, credits: 10, badge: "Fortnight Master" },
    { day: 30, xp: 500, credits: 25, badge: "Monthly Legend", special: "Premium Course Access" }
  ]

  // ⚡ Claim Daily Reward
  static async claimDailyReward(userId: string) {
    try {
      const today = new Date().toISOString().split('T')[0]
      const cacheKey = `daily:reward:${userId}:${today}`
      
      // Check if already claimed today
      const alreadyClaimed = await redis.get(cacheKey)
      if (alreadyClaimed) {
        return { success: false, message: 'Already claimed today' }
      }

      // Get current streak
      const streak = await this.getStreak(userId)
      const rewardDay = Math.min(streak.current, 30)
      
      // Find reward configuration
      const reward = this.DAILY_REWARDS.find(r => r.day <= rewardDay) || this.DAILY_REWARDS[0]
      const finalXP = reward.xp * streak.multiplier

      // Award XP
      await this.awardXP(userId, finalXP, 'daily_login')
      
      // Award credits if specified
      if (reward.credits) {
        await this.awardCredits(userId, reward.credits)
      }

      // Award badge if specified
      if (reward.badge) {
        await this.unlockAchievement(userId, reward.badge)
      }

      // Mark as claimed
      await redis.setex(cacheKey, 86400, 'claimed') // 24 hours

      // Log reward
      await prisma.userReward.create({
        data: {
          userId,
          rewardType: 'daily_login',
          rewardValue: finalXP,
          streakDay: streak.current
        }
      })

      return {
        success: true,
        reward: {
          ...reward,
          xp: finalXP,
          streakDay: streak.current,
          multiplier: streak.multiplier
        }
      }
    } catch (error) {
      console.error('Daily reward error:', error)
      return { success: false, message: 'Failed to claim reward' }
    }
  }

  // 🔥 Update Learning Streak
  static async updateStreak(userId: string): Promise<UserStreak> {
    try {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const streakKey = `user:streak:${userId}`
      const existingStreak = await redis.hgetall(streakKey)
      
      let currentStreak = 1
      let maxStreak = 1
      let lastLogin = today

      if (existingStreak.lastLogin) {
        const lastLoginDate = new Date(existingStreak.lastLogin)
        const daysDiff = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 0) {
          // Same day - no change
          currentStreak = parseInt(existingStreak.current) || 1
        } else if (daysDiff === 1) {
          // Consecutive day - increment streak
          currentStreak = (parseInt(existingStreak.current) || 0) + 1
        } else {
          // Streak broken - reset to 1
          currentStreak = 1
        }
        
        maxStreak = Math.max(currentStreak, parseInt(existingStreak.max) || 1)
      }

      // Calculate multiplier
      const multiplier = this.getStreakMultiplier(currentStreak)

      // Save streak data
      await redis.hmset(streakKey, {
        current: currentStreak.toString(),
        max: maxStreak.toString(),
        lastLogin: today.toISOString(),
        multiplier: multiplier.toString()
      })

      // Set expiry (keep for 48 hours to allow streak recovery)
      await redis.expire(streakKey, 172800)

      return {
        current: currentStreak,
        max: maxStreak,
        lastLogin: today,
        multiplier
      }
    } catch (error) {
      console.error('Streak update error:', error)
      return { current: 1, max: 1, lastLogin: new Date(), multiplier: 1 }
    }
  }

  // 📊 Get Current Streak
  static async getStreak(userId: string): Promise<UserStreak> {
    try {
      const streakKey = `user:streak:${userId}`
      const streak = await redis.hgetall(streakKey)
      
      if (!streak.current) {
        return await this.updateStreak(userId)
      }

      return {
        current: parseInt(streak.current) || 1,
        max: parseInt(streak.max) || 1,
        lastLogin: new Date(streak.lastLogin || new Date()),
        multiplier: parseInt(streak.multiplier) || 1
      }
    } catch (error) {
      console.error('Get streak error:', error)
      return { current: 1, max: 1, lastLogin: new Date(), multiplier: 1 }
    }
  }

  // ⭐ Award XP with Celebrations
  static async awardXP(userId: string, amount: number, source: string, sourceId?: string) {
    try {
      // Get current XP
      const xpKey = `user:xp:${userId}`
      const currentData = await redis.hgetall(xpKey)
      
      const currentXP = parseInt(currentData.totalXP) || 0
      const currentLevel = parseInt(currentData.level) || 1
      const newTotalXP = currentXP + amount

      // Calculate new level
      const newLevel = this.calculateLevel(newTotalXP)
      const leveledUp = newLevel > currentLevel

      // Update XP cache
      await redis.hmset(xpKey, {
        totalXP: newTotalXP.toString(),
        level: newLevel.toString(),
        xpToNext: this.getXPToNextLevel(newTotalXP).toString()
      })

      // Log XP gain
      await prisma.userXPLog.create({
        data: {
          userId,
          xpGained: amount,
          source,
          sourceId
        }
      })

      // Check for level up achievements
      if (leveledUp) {
        await this.checkLevelAchievements(userId, newLevel)
      }

      return {
        xpGained: amount,
        totalXP: newTotalXP,
        level: newLevel,
        leveledUp,
        xpToNext: this.getXPToNextLevel(newTotalXP)
      }
    } catch (error) {
      console.error('Award XP error:', error)
      return null
    }
  }

  // 💰 Award Credits
  static async awardCredits(userId: string, amount: number) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: amount
          }
        }
      })
      return true
    } catch (error) {
      console.error('Award credits error:', error)
      return false
    }
  }

  // 🏆 Unlock Achievement
  static async unlockAchievement(userId: string, achievementName: string) {
    try {
      // Check if already unlocked
      const existing = await prisma.userAchievement.findFirst({
        where: {
          userId,
          achievement: {
            name: achievementName
          }
        }
      })

      if (existing) return false

      // Find achievement
      const achievement = await prisma.achievement.findFirst({
        where: { name: achievementName }
      })

      if (!achievement) return false

      // Unlock achievement
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id
        }
      })

      // Award XP if specified
      if (achievement.xpReward > 0) {
        await this.awardXP(userId, achievement.xpReward, 'achievement', achievement.id)
      }

      return true
    } catch (error) {
      console.error('Unlock achievement error:', error)
      return false
    }
  }

  // 📈 Calculate Level from XP
  static calculateLevel(totalXP: number): number {
    // Level formula: Level = floor(sqrt(XP / 100)) + 1
    return Math.floor(Math.sqrt(totalXP / 100)) + 1
  }

  // 🎯 Get XP needed for next level
  static getXPToNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevel(currentXP)
    const nextLevelXP = Math.pow(currentLevel, 2) * 100
    return nextLevelXP - currentXP
  }

  // 🔥 Get Streak Multiplier
  static getStreakMultiplier(streakDays: number): number {
    if (streakDays >= 30) return 3
    if (streakDays >= 7) return 2
    return 1
  }

  // 🏆 Check Level Achievements
  static async checkLevelAchievements(userId: string, level: number) {
    const levelAchievements = [
      { level: 5, name: "Rising Star" },
      { level: 10, name: "Dedicated Learner" },
      { level: 25, name: "Knowledge Seeker" },
      { level: 50, name: "Learning Master" },
      { level: 100, name: "Legendary Scholar" }
    ]

    for (const achievement of levelAchievements) {
      if (level >= achievement.level) {
        await this.unlockAchievement(userId, achievement.name)
      }
    }
  }

  // 📊 Get User Stats
  static async getUserStats(userId: string) {
    try {
      const [xpData, streak, achievements] = await Promise.all([
        redis.hgetall(`user:xp:${userId}`),
        this.getStreak(userId),
        prisma.userAchievement.count({ where: { userId } })
      ])

      const totalXP = parseInt(xpData.totalXP) || 0
      const level = parseInt(xpData.level) || 1

      return {
        level,
        totalXP,
        xpToNext: this.getXPToNextLevel(totalXP),
        streak: streak.current,
        maxStreak: streak.max,
        achievements,
        multiplier: streak.multiplier
      }
    } catch (error) {
      console.error('Get user stats error:', error)
      return null
    }
  }
}

export default RewardsSystem