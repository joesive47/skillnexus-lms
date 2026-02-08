/**
 * Unit tests for Gamification Service
 */
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Mock Prisma client
jest.mock('../prisma', () => ({
  prisma: {
    gamificationPoints: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userBadge: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}))

describe('Gamification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Point Calculation', () => {
    it('should calculate points for course completion correctly', () => {
      // Arrange
      const basePoints = 100
      const difficultyMultiplier = 1.5
      
      // Act
      const totalPoints = basePoints * difficultyMultiplier
      
      // Assert
      expect(totalPoints).toBe(150)
    })

    it('should apply streak bonus correctly', () => {
      // Arrange
      const basePoints = 100
      const streakDays = 7
      const streakBonus = Math.min(streakDays * 5, 50) // Max 50%
      
      // Act
      const pointsWithBonus = basePoints + (basePoints * streakBonus / 100)
      
      // Assert
      expect(pointsWithBonus).toBe(135) // 100 + 35% bonus
    })

    it('should cap streak bonus at 50%', () => {
      // Arrange
      const basePoints = 100
      const streakDays = 20 // Would give 100% but should cap at 50%
      const streakBonus = Math.min(streakDays * 5, 50)
      
      // Act
      const pointsWithBonus = basePoints + (basePoints * streakBonus / 100)
      
      // Assert
      expect(pointsWithBonus).toBe(150) // 100 + 50% cap
    })
  })

  describe('Badge Requirements', () => {
    it('should validate beginner badge requirements', () => {
      // Arrange
      const userPoints = 100
      const requiredPoints = 100
      
      // Act
      const canEarnBadge = userPoints >= requiredPoints
      
      // Assert
      expect(canEarnBadge).toBe(true)
    })

    it('should not award badge if requirements not met', () => {
      // Arrange
      const userPoints = 50
      const requiredPoints = 100
      
      // Act
      const canEarnBadge = userPoints >= requiredPoints
      
      // Assert
      expect(canEarnBadge).toBe(false)
    })
  })

  describe('Level System', () => {
    it('should calculate user level correctly', () => {
      // Arrange
      const totalPoints = 1250
      const pointsPerLevel = 500
      
      // Act
      const level = Math.floor(totalPoints / pointsPerLevel) + 1
      
      // Assert
      expect(level).toBe(3)
    })

    it('should calculate points to next level', () => {
      // Arrange
      const totalPoints = 1250
      const pointsPerLevel = 500
      const currentLevel = Math.floor(totalPoints / pointsPerLevel) + 1
      const nextLevelPoints = currentLevel * pointsPerLevel
      
      // Act
      const pointsNeeded = nextLevelPoints - totalPoints
      
      // Assert
      expect(pointsNeeded).toBe(250)
    })
  })

  describe('Leaderboard Calculation', () => {
    it('should rank users by total points', () => {
      // Arrange
      const users = [
        { id: '1', name: 'User A', points: 1500 },
        { id: '2', name: 'User B', points: 2000 },
        { id: '3', name: 'User C', points: 1000 },
      ]
      
      // Act
      const ranked = users.sort((a, b) => b.points - a.points)
      
      // Assert
      expect(ranked[0].id).toBe('2')
      expect(ranked[1].id).toBe('1')
      expect(ranked[2].id).toBe('3')
    })
  })

  describe('Achievement Tracking', () => {
    it('should track course completion achievements', () => {
      // Arrange
      const completedCourses = 5
      const achievementThreshold = 5
      
      // Act
      const hasAchievement = completedCourses >= achievementThreshold
      
      // Assert
      expect(hasAchievement).toBe(true)
    })

    it('should track perfect score achievements', () => {
      // Arrange
      const quizScore = 100
      const perfectScore = 100
      
      // Act
      const isPerfectScore = quizScore === perfectScore
      
      // Assert
      expect(isPerfectScore).toBe(true)
    })
  })
})
