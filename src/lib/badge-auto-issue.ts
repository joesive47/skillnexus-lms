import { BadgeService } from './badge-service'

export class BadgeAutoIssue {
  private badgeService = new BadgeService()

  async onCourseComplete(userId: string, courseId: string) {
    console.log(`Course completed: ${courseId} by user: ${userId}`)
    await this.checkAndIssueBadges(userId)
  }

  async onQuizPass(userId: string, quizId: string, score: number) {
    console.log(`Quiz passed: ${quizId} by user: ${userId} with score: ${score}`)
    await this.checkAndIssueBadges(userId)
  }

  async onLessonComplete(userId: string, lessonId: string) {
    console.log(`Lesson completed: ${lessonId} by user: ${userId}`)
    await this.checkAndIssueBadges(userId)
  }

  private async checkAndIssueBadges(userId: string) {
    try {
      const issuedBadges = await this.badgeService.checkAllBadgesForUser(userId)
      
      if (issuedBadges.length > 0) {
        console.log(`Issued ${issuedBadges.length} new badges for user: ${userId}`)
        
        // Here you could add notification logic
        // await this.sendBadgeNotification(userId, issuedBadges)
      }
    } catch (error) {
      console.error('Error in auto badge issuance:', error)
    }
  }

  // Integration points for existing course completion logic
  static async triggerOnCourseComplete(userId: string, courseId: string) {
    const autoIssue = new BadgeAutoIssue()
    await autoIssue.onCourseComplete(userId, courseId)
  }

  static async triggerOnQuizPass(userId: string, quizId: string, score: number) {
    const autoIssue = new BadgeAutoIssue()
    await autoIssue.onQuizPass(userId, quizId, score)
  }

  static async triggerOnLessonComplete(userId: string, lessonId: string) {
    const autoIssue = new BadgeAutoIssue()
    await autoIssue.onLessonComplete(userId, lessonId)
  }
}