import { prisma } from './prisma'

interface LearningProfile {
  userId: string
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
  learningPace: 'slow' | 'normal' | 'fast'
  interests: string[]
  completedCourses: string[]
  currentGoals: string[]
  weakAreas: string[]
  strongAreas: string[]
  studyTimePreference: 'morning' | 'afternoon' | 'evening' | 'night'
  sessionDuration: number // minutes
}

interface CourseRecommendation {
  courseId: string
  title: string
  description: string
  difficulty: string
  estimatedDuration: number
  relevanceScore: number
  reasons: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  adaptiveFeatures: {
    personalizedPath: boolean
    adaptiveDifficulty: boolean
    customPacing: boolean
  }
}

interface LearningPath {
  id: string
  name: string
  description: string
  courses: CourseRecommendation[]
  estimatedCompletionTime: number
  difficultyProgression: string[]
  milestones: {
    courseId: string
    title: string
    skills: string[]
  }[]
}

interface StudySession {
  userId: string
  courseId: string
  duration: number
  completionRate: number
  engagementScore: number
  difficultyRating: number
  timestamp: Date
  learningStyle: string
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'vr'
}

class AILearningRecommendationEngine {
  private userProfiles: Map<string, LearningProfile> = new Map()
  private courseDatabase: Map<string, any> = new Map()

  // Initialize user learning profile
  async initializeUserProfile(userId: string): Promise<LearningProfile> {
    try {
      // Get user data from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          enrollments: {
            include: {
              course: true
            }
          },
          certificates: {
            include: {
              course: true
            }
          }
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Analyze user's learning patterns
      const studySessions = await this.getUserStudySessions(userId)
      const learningStyle = this.detectLearningStyle(studySessions)
      const learningPace = this.detectLearningPace(studySessions)
      const skillLevel = this.assessSkillLevel(user.certificates)

      const profile: LearningProfile = {
        userId,
        preferredLearningStyle: learningStyle,
        skillLevel,
        learningPace,
        interests: [],
        completedCourses: user.certificates.map(c => c.courseId),
        currentGoals: [],
        weakAreas: await this.identifyWeakAreas(userId),
        strongAreas: await this.identifyStrongAreas(userId),
        studyTimePreference: this.detectStudyTimePreference(studySessions),
        sessionDuration: this.calculateOptimalSessionDuration(studySessions)
      }

      this.userProfiles.set(userId, profile)
      return profile
    } catch (error) {
      console.error('Error initializing user profile:', error)
      throw error
    }
  }

  // Generate personalized course recommendations
  async generateCourseRecommendations(userId: string, limit: number = 10): Promise<CourseRecommendation[]> {
    const profile = await this.getUserProfile(userId)
    const availableCourses = await this.getAvailableCourses()
    
    const recommendations: CourseRecommendation[] = []

    for (const course of availableCourses) {
      if (profile.completedCourses.includes(course.id)) {
        continue // Skip completed courses
      }

      const relevanceScore = this.calculateRelevanceScore(profile, course)
      
      if (relevanceScore > 0.3) { // Minimum threshold
        const recommendation: CourseRecommendation = {
          courseId: course.id,
          title: course.title,
          description: course.description,
          difficulty: course.difficulty,
          estimatedDuration: course.estimatedDuration,
          relevanceScore,
          reasons: this.generateRecommendationReasons(profile, course, relevanceScore),
          prerequisites: course.prerequisites || [],
          learningOutcomes: course.learningOutcomes || [],
          adaptiveFeatures: {
            personalizedPath: true,
            adaptiveDifficulty: this.shouldUseAdaptiveDifficulty(profile, course),
            customPacing: profile.learningPace !== 'normal'
          }
        }

        recommendations.push(recommendation)
      }
    }

    // Sort by relevance score and return top recommendations
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
  }

  // Generate adaptive learning paths
  async generateLearningPath(userId: string, goalSkill: string): Promise<LearningPath> {
    const profile = await this.getUserProfile(userId)
    const recommendations = await this.generateCourseRecommendations(userId, 20)
    
    // Filter courses relevant to the goal skill
    const relevantCourses = recommendations.filter(course => 
      course.learningOutcomes.some(outcome => 
        outcome.toLowerCase().includes(goalSkill.toLowerCase())
      )
    )

    // Sort courses by difficulty progression
    const sortedCourses = this.sortCoursesByDifficultyProgression(relevantCourses, profile)
    
    // Create milestones
    const milestones = this.createLearningMilestones(sortedCourses)
    
    const learningPath: LearningPath = {
      id: `path_${userId}_${goalSkill}_${Date.now()}`,
      name: `${goalSkill} Learning Path`,
      description: `Personalized learning path to master ${goalSkill} based on your learning profile`,
      courses: sortedCourses,
      estimatedCompletionTime: sortedCourses.reduce((total, course) => total + course.estimatedDuration, 0),
      difficultyProgression: sortedCourses.map(course => course.difficulty),
      milestones
    }

    return learningPath
  }

  // Real-time adaptive recommendations during learning
  async getAdaptiveRecommendations(userId: string, currentCourseId: string, currentProgress: number): Promise<{
    nextTopics: string[]
    difficultyAdjustment: 'increase' | 'decrease' | 'maintain'
    recommendedBreak: boolean
    alternativeResources: string[]
  }> {
    const profile = await this.getUserProfile(userId)
    const recentSessions = await this.getRecentStudySessions(userId, 5)
    
    // Analyze recent performance
    const avgEngagement = recentSessions.reduce((sum, s) => sum + s.engagementScore, 0) / recentSessions.length
    const avgDifficulty = recentSessions.reduce((sum, s) => sum + s.difficultyRating, 0) / recentSessions.length
    
    // Determine difficulty adjustment
    let difficultyAdjustment: 'increase' | 'decrease' | 'maintain' = 'maintain'
    if (avgEngagement > 0.8 && avgDifficulty < 0.6) {
      difficultyAdjustment = 'increase'
    } else if (avgEngagement < 0.5 || avgDifficulty > 0.8) {
      difficultyAdjustment = 'decrease'
    }

    // Check if break is recommended
    const lastSessionDuration = recentSessions[0]?.duration || 0
    const recommendedBreak = lastSessionDuration > profile.sessionDuration * 1.5

    // Get next topics based on current progress
    const nextTopics = await this.getNextTopics(currentCourseId, currentProgress, profile)
    
    // Get alternative resources
    const alternativeResources = await this.getAlternativeResources(currentCourseId, profile.preferredLearningStyle)

    return {
      nextTopics,
      difficultyAdjustment,
      recommendedBreak,
      alternativeResources
    }
  }

  // Private helper methods
  private async getUserProfile(userId: string): Promise<LearningProfile> {
    if (!this.userProfiles.has(userId)) {
      await this.initializeUserProfile(userId)
    }
    return this.userProfiles.get(userId)!
  }

  private async getUserStudySessions(userId: string): Promise<StudySession[]> {
    // In a real implementation, this would fetch from database
    // For now, return mock data
    return []
  }

  private detectLearningStyle(sessions: StudySession[]): 'visual' | 'auditory' | 'kinesthetic' | 'reading' {
    // Analyze session data to detect learning style
    // This is a simplified implementation
    return 'visual' // Default
  }

  private detectLearningPace(sessions: StudySession[]): 'slow' | 'normal' | 'fast' {
    if (sessions.length === 0) return 'normal'
    
    const avgCompletionRate = sessions.reduce((sum, s) => sum + s.completionRate, 0) / sessions.length
    
    if (avgCompletionRate > 0.8) return 'fast'
    if (avgCompletionRate < 0.4) return 'slow'
    return 'normal'
  }

  private assessSkillLevel(completedCourses: any[]): 'beginner' | 'intermediate' | 'advanced' {
    const courseCount = completedCourses.length
    
    if (courseCount === 0) return 'beginner'
    if (courseCount < 5) return 'beginner'
    if (courseCount < 15) return 'intermediate'
    return 'advanced'
  }

  private async identifyWeakAreas(userId: string): Promise<string[]> {
    // Analyze quiz results, completion rates, etc.
    return []
  }

  private async identifyStrongAreas(userId: string): Promise<string[]> {
    // Analyze high-performing areas
    return []
  }

  private detectStudyTimePreference(sessions: StudySession[]): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (sessions.length === 0) return 'evening'
    
    const hourCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 }
    
    sessions.forEach(session => {
      const hour = session.timestamp.getHours()
      if (hour >= 6 && hour < 12) hourCounts.morning++
      else if (hour >= 12 && hour < 17) hourCounts.afternoon++
      else if (hour >= 17 && hour < 22) hourCounts.evening++
      else hourCounts.night++
    })
    
    return Object.entries(hourCounts).reduce((a, b) => hourCounts[a[0] as keyof typeof hourCounts] > hourCounts[b[0] as keyof typeof hourCounts] ? a : b)[0] as 'morning' | 'afternoon' | 'evening' | 'night'
  }

  private calculateOptimalSessionDuration(sessions: StudySession[]): number {
    if (sessions.length === 0) return 45 // Default 45 minutes
    
    // Find sessions with highest engagement scores
    const highEngagementSessions = sessions.filter(s => s.engagementScore > 0.7)
    
    if (highEngagementSessions.length === 0) return 45
    
    const avgDuration = highEngagementSessions.reduce((sum, s) => sum + s.duration, 0) / highEngagementSessions.length
    return Math.round(avgDuration)
  }

  private async getAvailableCourses(): Promise<any[]> {
    try {
      return await prisma.course.findMany({
        where: { published: true },
        include: {
          lessons: true
        }
      })
    } catch (error) {
      console.error('Error fetching courses:', error)
      return []
    }
  }

  private calculateRelevanceScore(profile: LearningProfile, course: any): number {
    let score = 0

    // Interest matching (40% weight)
    const interestMatch = profile.interests.some(interest => 
      course.title.toLowerCase().includes(interest.toLowerCase()) ||
      course.description.toLowerCase().includes(interest.toLowerCase())
    )
    if (interestMatch) score += 0.4

    // Skill level matching (30% weight)
    const skillLevelMatch = this.matchSkillLevel(profile.skillLevel, course.difficulty)
    score += skillLevelMatch * 0.3

    // Goal alignment (20% weight)
    const goalMatch = profile.currentGoals.some(goal =>
      course.learningOutcomes?.some((outcome: string) => 
        outcome.toLowerCase().includes(goal.toLowerCase())
      )
    )
    if (goalMatch) score += 0.2

    // Weak area improvement (10% weight)
    const weakAreaMatch = profile.weakAreas.some(area =>
      course.learningOutcomes?.some((outcome: string) =>
        outcome.toLowerCase().includes(area.toLowerCase())
      )
    )
    if (weakAreaMatch) score += 0.1

    return Math.min(score, 1.0) // Cap at 1.0
  }

  private matchSkillLevel(userLevel: string, courseDifficulty: string): number {
    const levelMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 }
    const difficultyMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 }
    
    const userLevelNum = levelMap[userLevel] || 1
    const courseDifficultyNum = difficultyMap[courseDifficulty] || 1
    
    const difference = Math.abs(userLevelNum - courseDifficultyNum)
    
    if (difference === 0) return 1.0
    if (difference === 1) return 0.7
    return 0.3
  }

  private generateRecommendationReasons(profile: LearningProfile, course: any, score: number): string[] {
    const reasons: string[] = []
    
    if (score > 0.8) {
      reasons.push('Highly relevant to your learning goals')
    }
    
    if (profile.interests.some(interest => 
      course.title.toLowerCase().includes(interest.toLowerCase())
    )) {
      reasons.push('Matches your interests')
    }
    
    if (this.matchSkillLevel(profile.skillLevel, course.difficulty) > 0.7) {
      reasons.push('Perfect difficulty level for you')
    }
    
    if (profile.weakAreas.some(area =>
      course.learningOutcomes?.some((outcome: string) =>
        outcome.toLowerCase().includes(area.toLowerCase())
      )
    )) {
      reasons.push('Helps improve your weak areas')
    }
    
    return reasons
  }

  private shouldUseAdaptiveDifficulty(profile: LearningProfile, course: any): boolean {
    return profile.learningPace !== 'normal' || profile.skillLevel === 'beginner'
  }

  private sortCoursesByDifficultyProgression(courses: CourseRecommendation[], profile: LearningProfile): CourseRecommendation[] {
    const difficultyOrder = ['beginner', 'intermediate', 'advanced']
    
    return courses.sort((a, b) => {
      const aIndex = difficultyOrder.indexOf(a.difficulty)
      const bIndex = difficultyOrder.indexOf(b.difficulty)
      return aIndex - bIndex
    })
  }

  private createLearningMilestones(courses: CourseRecommendation[]): any[] {
    return courses.map((course, index) => ({
      courseId: course.courseId,
      title: `Milestone ${index + 1}: ${course.title}`,
      skills: course.learningOutcomes
    }))
  }

  private async getRecentStudySessions(userId: string, limit: number): Promise<StudySession[]> {
    // Mock implementation
    return []
  }

  private async getNextTopics(courseId: string, progress: number, profile: LearningProfile): Promise<string[]> {
    // Mock implementation
    return ['Next Topic 1', 'Next Topic 2', 'Next Topic 3']
  }

  private async getAlternativeResources(courseId: string, learningStyle: string): Promise<string[]> {
    // Mock implementation based on learning style
    const resources: Record<string, string[]> = {
      visual: ['Interactive Diagrams', 'Video Tutorials', 'Infographics'],
      auditory: ['Podcasts', 'Audio Lectures', 'Discussion Forums'],
      kinesthetic: ['Hands-on Labs', 'Interactive Simulations', 'Practice Projects'],
      reading: ['Text-based Tutorials', 'Documentation', 'Case Studies']
    }
    
    return resources[learningStyle] || resources.visual
  }
}

// Export singleton instance
export const aiRecommendationEngine = new AILearningRecommendationEngine()

// Utility functions for integration
export async function getUserRecommendations(userId: string, limit?: number) {
  return await aiRecommendationEngine.generateCourseRecommendations(userId, limit)
}

export async function createLearningPath(userId: string, goalSkill: string) {
  return await aiRecommendationEngine.generateLearningPath(userId, goalSkill)
}

export async function getAdaptiveGuidance(userId: string, courseId: string, progress: number) {
  return await aiRecommendationEngine.getAdaptiveRecommendations(userId, courseId, progress)
}