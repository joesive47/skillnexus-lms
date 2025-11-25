// Phase 3: Collaboration API
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CollaborationEngine } from '@/lib/collaboration-phase3'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'my-groups':
        const groups = await CollaborationEngine.getUserStudyGroups(session.user.id)
        return NextResponse.json(groups)

      case 'search-groups':
        const query = searchParams.get('query')
        const courseId = searchParams.get('courseId')
        const limit = parseInt(searchParams.get('limit') || '20')
        const searchResults = await CollaborationEngine.searchStudyGroups(query || undefined, courseId || undefined, limit)
        return NextResponse.json(searchResults)

      case 'discussions':
        const groupId = searchParams.get('groupId')
        if (!groupId) return NextResponse.json({ error: 'Group ID required' }, { status: 400 })
        const discussions = await CollaborationEngine.getGroupDiscussions(groupId, session.user.id)
        return NextResponse.json(discussions)

      case 'sessions':
        const sessions = await CollaborationEngine.getUpcomingSessions(session.user.id)
        return NextResponse.json(sessions)

      case 'peer-reviews':
        const reviews = await CollaborationEngine.getUserPeerReviews(session.user.id)
        return NextResponse.json(reviews)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Collaboration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'create-group':
        const { name, description, courseId, isPublic, maxMembers } = body
        const group = await CollaborationEngine.createStudyGroup(session.user.id, {
          name, description, courseId, isPublic, maxMembers
        })
        return NextResponse.json(group)

      case 'join-group':
        const { groupId } = body
        const member = await CollaborationEngine.joinStudyGroup(groupId, session.user.id)
        return NextResponse.json(member)

      case 'create-discussion':
        const { groupId: discussionGroupId, title, content } = body
        const discussion = await CollaborationEngine.createDiscussion(discussionGroupId, session.user.id, title, content)
        return NextResponse.json(discussion)

      case 'reply-discussion':
        const { discussionId, content: replyContent, parentId } = body
        const reply = await CollaborationEngine.replyToDiscussion(discussionId, session.user.id, replyContent, parentId)
        return NextResponse.json(reply)

      case 'schedule-session':
        const { groupId: sessionGroupId, title: sessionTitle, description: sessionDesc, scheduledAt, duration } = body
        const studySession = await CollaborationEngine.scheduleStudySession(
          sessionGroupId, session.user.id, sessionTitle, sessionDesc, new Date(scheduledAt), duration
        )
        return NextResponse.json(studySession)

      case 'register-session':
        const { sessionId } = body
        const attendance = await CollaborationEngine.registerForSession(sessionId, session.user.id)
        return NextResponse.json(attendance)

      case 'submit-review':
        const { revieweeId, rating, comment, courseId: reviewCourseId, lessonId, isAnonymous } = body
        const review = await CollaborationEngine.submitPeerReview(
          session.user.id, revieweeId, rating, comment, reviewCourseId, lessonId, isAnonymous
        )
        return NextResponse.json(review)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Collaboration action error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}