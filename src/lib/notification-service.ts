/**
 * Notification Service
 * Centralized service for sending notifications
 */

import prisma from '@/lib/prisma'

export type NotificationType =
  | 'COURSE_ENROLLED'
  | 'LESSON_COMPLETED'
  | 'QUIZ_PASSED'
  | 'QUIZ_FAILED'
  | 'CERTIFICATE_ISSUED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'COURSE_COMPLETED'
  | 'FINAL_EXAM_AVAILABLE'
  | 'REMINDER'
  | 'SYSTEM'

interface NotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  metadata?: any
}

class NotificationService {
  /**
   * Send a notification to a user
   */
  async send(data: NotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          actionUrl: data.actionUrl,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          isRead: false
        }
      })

      console.log(`📧 Notification sent to user ${data.userId}: ${data.title}`)
      return notification
    } catch (error) {
      console.error('Failed to send notification:', error)
      throw error
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulk(notifications: NotificationData[]) {
    try {
      const created = await prisma.notification.createMany({
        data: notifications.map(n => ({
          userId: n.userId,
          type: n.type,
          title: n.title,
          message: n.message,
          actionUrl: n.actionUrl,
          metadata: n.metadata ? JSON.stringify(n.metadata) : null,
          isRead: false
        }))
      })

      console.log(`📧 Sent ${created.count} notifications`)
      return created
    } catch (error) {
      console.error('Failed to send bulk notifications:', error)
      throw error
    }
  }

  /**
   * Pre-defined notification templates
   */
  async notifyCourseEnrolled(userId: string, courseName: string, courseId: string) {
    return this.send({
      userId,
      type: 'COURSE_ENROLLED',
      title: 'เข้าเรียนคอร์สใหม่!',
      message: `คุณได้เข้าเรียนคอร์ส "${courseName}" เรียบร้อยแล้ว`,
      actionUrl: `/courses/${courseId}`,
      metadata: { courseId, courseName }
    })
  }

  async notifyLessonCompleted(userId: string, lessonTitle: string, courseId: string) {
    return this.send({
      userId,
      type: 'LESSON_COMPLETED',
      title: 'เรียนจบบทเรียนแล้ว! 🎉',
      message: `คุณเรียนจบ "${lessonTitle}" เรียบร้อยแล้ว`,
      actionUrl: `/courses/${courseId}`,
      metadata: { lessonTitle }
    })
  }

  async notifyQuizPassed(userId: string, quizTitle: string, score: number, courseId: string) {
    return this.send({
      userId,
      type: 'QUIZ_PASSED',
      title: 'ผ่านแบบทดสอบ! ✅',
      message: `คุณสอบผ่าน "${quizTitle}" ได้ ${score}%`,
      actionUrl: `/courses/${courseId}`,
      metadata: { quizTitle, score }
    })
  }

  async notifyQuizFailed(userId: string, quizTitle: string, score: number, courseId: string) {
    return this.send({
      userId,
      type: 'QUIZ_FAILED',
      title: 'สอบไม่ผ่าน',
      message: `คุณได้คะแนน ${score}% ใน "${quizTitle}" ลองใหม่อีกครั้งนะ!`,
      actionUrl: `/courses/${courseId}`,
      metadata: { quizTitle, score }
    })
  }

  async notifyCertificateIssued(
    userId: string,
    courseName: string,
    verificationCode: string,
    certificateId: string
  ) {
    return this.send({
      userId,
      type: 'CERTIFICATE_ISSUED',
      title: 'ได้รับใบประกาศนียบัตร! 🏆',
      message: `ยินดีด้วย! คุณได้รับใบประกาศนียบัตรจากคอร์ส "${courseName}"`,
      actionUrl: `/certificates/${certificateId}/download`,
      metadata: { courseName, verificationCode, certificateId }
    })
  }

  async notifyAchievementUnlocked(
    userId: string,
    achievementName: string,
    description: string,
    xpReward: number
  ) {
    return this.send({
      userId,
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'ปลดล็อก Achievement! 🏅',
      message: `คุณได้รับ "${achievementName}" และ ${xpReward} XP!`,
      actionUrl: '/profile/achievements',
      metadata: { achievementName, description, xpReward }
    })
  }

  async notifyCourseCompleted(userId: string, courseName: string, courseId: string) {
    return this.send({
      userId,
      type: 'COURSE_COMPLETED',
      title: 'เรียนจบคอร์สแล้ว! 🎓',
      message: `ยินดีด้วย! คุณเรียนจบคอร์ส "${courseName}" แล้ว`,
      actionUrl: `/courses/${courseId}`,
      metadata: { courseName, courseId }
    })
  }

  async notifyFinalExamAvailable(userId: string, courseName: string, courseId: string) {
    return this.send({
      userId,
      type: 'FINAL_EXAM_AVAILABLE',
      title: 'พร้อมสอบ Final แล้ว! 🎯',
      message: `คุณสามารถเข้าสอบ Final ของคอร์ส "${courseName}" ได้แล้ว`,
      actionUrl: `/courses/${courseId}/final-exam`,
      metadata: { courseName, courseId }
    })
  }

  async notifyReminder(userId: string, title: string, message: string, actionUrl?: string) {
    return this.send({
      userId,
      type: 'REMINDER',
      title,
      message,
      actionUrl,
      metadata: {}
    })
  }

  /**
   * Delete old read notifications (cleanup)
   */
  async cleanupOldNotifications(daysOld = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const deleted = await prisma.notification.deleteMany({
      where: {
        isRead: true,
        readAt: {
          lt: cutoffDate
        }
      }
    })

    console.log(`🧹 Deleted ${deleted.count} old notifications`)
    return deleted
  }
}

export const notificationService = new NotificationService()
