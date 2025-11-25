// Phase 3: Collaboration System
import { prisma } from './prisma'

export interface StudyGroupData {
  name: string
  description?: string
  courseId?: string
  isPublic: boolean
  maxMembers: number
}

export class CollaborationEngine {
  // Create study group
  static async createStudyGroup(creatorId: string, data: StudyGroupData) {
    const group = await prisma.studyGroup.create({
      data: {
        ...data,
        creatorId,
        members: {
          create: {
            userId: creatorId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        members: { include: { user: true } },
        course: true
      }
    })

    return group
  }

  // Join study group
  static async joinStudyGroup(groupId: string, userId: string) {
    const group = await prisma.studyGroup.findUnique({
      where: { id: groupId },
      include: { members: true }
    })

    if (!group) throw new Error('Study group not found')
    if (!group.isPublic) throw new Error('Group is private')
    if (group.members.length >= group.maxMembers) throw new Error('Group is full')

    const existingMember = group.members.find(m => m.userId === userId)
    if (existingMember) throw new Error('Already a member')

    const member = await prisma.studyGroupMember.create({
      data: {
        groupId,
        userId,
        role: 'MEMBER'
      },
      include: { user: true }
    })

    return member
  }

  // Create discussion
  static async createDiscussion(groupId: string, authorId: string, title: string, content: string) {
    // Check if user is member
    const member = await prisma.studyGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId: authorId } }
    })

    if (!member) throw new Error('Not a group member')

    const discussion = await prisma.groupDiscussion.create({
      data: {
        groupId,
        title,
        content,
        authorId
      },
      include: {
        author: { select: { name: true, email: true } },
        replies: {
          include: {
            author: { select: { name: true, email: true } }
          }
        }
      }
    })

    return discussion
  }

  // Reply to discussion
  static async replyToDiscussion(discussionId: string, authorId: string, content: string, parentId?: string) {
    const discussion = await prisma.groupDiscussion.findUnique({
      where: { id: discussionId },
      include: { group: true }
    })

    if (!discussion) throw new Error('Discussion not found')

    // Check if user is member
    const member = await prisma.studyGroupMember.findUnique({
      where: { 
        groupId_userId: { 
          groupId: discussion.groupId, 
          userId: authorId 
        } 
      }
    })

    if (!member) throw new Error('Not a group member')

    const reply = await prisma.discussionReply.create({
      data: {
        discussionId,
        content,
        authorId,
        parentId
      },
      include: {
        author: { select: { name: true, email: true } },
        replies: {
          include: {
            author: { select: { name: true, email: true } }
          }
        }
      }
    })

    return reply
  }

  // Schedule study session
  static async scheduleStudySession(
    groupId: string, 
    createdBy: string, 
    title: string, 
    description: string, 
    scheduledAt: Date, 
    duration: number
  ) {
    // Check if user is admin or moderator
    const member = await prisma.studyGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId: createdBy } }
    })

    if (!member || !['ADMIN', 'MODERATOR'].includes(member.role)) {
      throw new Error('Insufficient permissions')
    }

    const session = await prisma.studySession.create({
      data: {
        groupId,
        title,
        description,
        scheduledAt,
        duration,
        createdBy
      },
      include: {
        group: true,
        creator: { select: { name: true, email: true } }
      }
    })

    return session
  }

  // Register for study session
  static async registerForSession(sessionId: string, userId: string) {
    const session = await prisma.studySession.findUnique({
      where: { id: sessionId },
      include: { group: { include: { members: true } } }
    })

    if (!session) throw new Error('Session not found')

    // Check if user is group member
    const isMember = session.group.members.some(m => m.userId === userId)
    if (!isMember) throw new Error('Not a group member')

    const attendance = await prisma.sessionAttendance.upsert({
      where: { sessionId_userId: { sessionId, userId } },
      create: {
        sessionId,
        userId,
        status: 'REGISTERED'
      },
      update: {
        status: 'REGISTERED'
      },
      include: {
        user: { select: { name: true, email: true } }
      }
    })

    return attendance
  }

  // Submit peer review
  static async submitPeerReview(
    reviewerId: string,
    revieweeId: string,
    rating: number,
    comment?: string,
    courseId?: string,
    lessonId?: string,
    isAnonymous: boolean = false
  ) {
    if (reviewerId === revieweeId) throw new Error('Cannot review yourself')
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5')

    const review = await prisma.peerReview.create({
      data: {
        reviewerId,
        revieweeId,
        rating,
        comment,
        courseId,
        lessonId,
        isAnonymous
      },
      include: {
        reviewer: { select: { name: true, email: true } },
        reviewee: { select: { name: true, email: true } },
        course: { select: { title: true } },
        lesson: { select: { title: true } }
      }
    })

    return review
  }

  // Get user's study groups
  static async getUserStudyGroups(userId: string) {
    const memberships = await prisma.studyGroupMember.findMany({
      where: { userId, isActive: true },
      include: {
        group: {
          include: {
            course: true,
            members: { include: { user: { select: { name: true, email: true } } } },
            _count: { select: { discussions: true, sessions: true } }
          }
        }
      }
    })

    return memberships.map(m => ({
      ...m.group,
      userRole: m.role,
      joinedAt: m.joinedAt
    }))
  }

  // Get group discussions
  static async getGroupDiscussions(groupId: string, userId: string) {
    // Check if user is member
    const member = await prisma.studyGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId } }
    })

    if (!member) throw new Error('Not a group member')

    const discussions = await prisma.groupDiscussion.findMany({
      where: { groupId },
      include: {
        author: { select: { name: true, email: true } },
        replies: {
          include: {
            author: { select: { name: true, email: true } },
            replies: {
              include: {
                author: { select: { name: true, email: true } }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: { select: { replies: true } }
      },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    return discussions
  }

  // Get upcoming study sessions
  static async getUpcomingSessions(userId: string) {
    const userGroups = await prisma.studyGroupMember.findMany({
      where: { userId, isActive: true },
      select: { groupId: true }
    })

    const groupIds = userGroups.map(g => g.groupId)

    const sessions = await prisma.studySession.findMany({
      where: {
        groupId: { in: groupIds },
        scheduledAt: { gte: new Date() },
        status: { in: ['SCHEDULED', 'ACTIVE'] }
      },
      include: {
        group: { select: { name: true } },
        creator: { select: { name: true, email: true } },
        attendees: {
          where: { userId },
          select: { status: true }
        },
        _count: { select: { attendees: true } }
      },
      orderBy: { scheduledAt: 'asc' }
    })

    return sessions.map(session => ({
      ...session,
      userStatus: session.attendees[0]?.status || 'NOT_REGISTERED'
    }))
  }

  // Get peer reviews for user
  static async getUserPeerReviews(userId: string) {
    const reviewsReceived = await prisma.peerReview.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { 
          select: { 
            name: true, 
            email: true 
          } 
        },
        course: { select: { title: true } },
        lesson: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const reviewsGiven = await prisma.peerReview.findMany({
      where: { reviewerId: userId },
      include: {
        reviewee: { 
          select: { 
            name: true, 
            email: true 
          } 
        },
        course: { select: { title: true } },
        lesson: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate average rating received
    const avgRating = reviewsReceived.length > 0 
      ? reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / reviewsReceived.length 
      : 0

    return {
      received: reviewsReceived,
      given: reviewsGiven,
      averageRating: Math.round(avgRating * 100) / 100,
      totalReceived: reviewsReceived.length,
      totalGiven: reviewsGiven.length
    }
  }

  // Search public study groups
  static async searchStudyGroups(query?: string, courseId?: string, limit: number = 20) {
    const where: any = {
      isPublic: true,
      isActive: true
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (courseId) {
      where.courseId = courseId
    }

    const groups = await prisma.studyGroup.findMany({
      where,
      include: {
        course: { select: { title: true } },
        creator: { select: { name: true, email: true } },
        members: { select: { userId: true } },
        _count: { 
          select: { 
            members: true, 
            discussions: true, 
            sessions: true 
          } 
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return groups.map(group => ({
      ...group,
      memberCount: group._count.members,
      availableSpots: group.maxMembers - group._count.members
    }))
  }
}