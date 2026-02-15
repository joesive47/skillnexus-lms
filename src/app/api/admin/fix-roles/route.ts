import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * Admin API Route: Fix User Roles
 * 
 * Purpose: Correct user roles in production database based on seed data
 * Access: ADMIN only
 * Method: POST
 * 
 * Usage:
 * POST /api/admin/fix-roles
 * Headers: Authentication required (session-based)
 * Body: { "dryRun": true } - optional, defaults to true for safety
 * 
 * Response:
 * {
 *   "success": true,
 *   "dryRun": true,
 *   "changes": [
 *     { "email": "joesive47@gmail.com", "from": "ADMIN", "to": "STUDENT" }
 *   ],
 *   "summary": {
 *     "studentsFixed": 1,
 *     "teachersFixed": 0,
 *     "adminsFixed": 0,
 *     "totalFixed": 1
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication Check
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // 2. Parse request body
    const body = await request.json().catch(() => ({}))
    const dryRun = body.dryRun !== false // Default to true for safety

    // 3. Define expected roles based on seed data
    const expectedRoles = {
      STUDENT: [
        'joesive47@gmail.com',
        'student1@example.com',
        'student2@example.com',
        'jss.siriwut@gmail.com',
        'student.demo@skillnexus.com',
        'learner1@skillnexus.com',
        'learner2@skillnexus.com',
        'learner3@skillnexus.com',
      ],
      TEACHER: [
        'teacher@example.com',
        'teacher@skillnexus.com',
        'instructor@skillnexus.com',
        'tutor@skillnexus.com',
      ],
      ADMIN: [
        'admin@skillnexus.com',
        'admin@bizsolve-ai.com',
        'admin@example.com',
      ],
    }

    // 4. Find users with wrong roles
    const allEmails = [
      ...expectedRoles.STUDENT,
      ...expectedRoles.TEACHER,
      ...expectedRoles.ADMIN,
    ]

    const users = await prisma.user.findMany({
      where: {
        email: { in: allEmails },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    // 5. Identify changes needed
    const changes: Array<{
      email: string
      name: string | null
      from: string
      to: string
      userId: string
    }> = []

    for (const user of users) {
      let expectedRole: string | null = null

      if (expectedRoles.STUDENT.includes(user.email)) {
        expectedRole = 'STUDENT'
      } else if (expectedRoles.TEACHER.includes(user.email)) {
        expectedRole = 'TEACHER'
      } else if (expectedRoles.ADMIN.includes(user.email)) {
        expectedRole = 'ADMIN'
      }

      if (expectedRole && user.role !== expectedRole) {
        changes.push({
          email: user.email,
          name: user.name,
          from: user.role,
          to: expectedRole,
          userId: user.id,
        })
      }
    }

    // 6. Apply changes (if not dry run)
    let summary = {
      studentsFixed: 0,
      teachersFixed: 0,
      adminsFixed: 0,
      totalFixed: 0,
    }

    if (!dryRun && changes.length > 0) {
      for (const change of changes) {
        await prisma.user.update({
          where: { id: change.userId },
          data: { role: change.to as any },
        })

        // Update summary
        if (change.to === 'STUDENT') summary.studentsFixed++
        else if (change.to === 'TEACHER') summary.teachersFixed++
        else if (change.to === 'ADMIN') summary.adminsFixed++
        summary.totalFixed++
      }
    } else {
      // Dry run - just count what would be changed
      for (const change of changes) {
        if (change.to === 'STUDENT') summary.studentsFixed++
        else if (change.to === 'TEACHER') summary.teachersFixed++
        else if (change.to === 'ADMIN') summary.adminsFixed++
        summary.totalFixed++
      }
    }

    // 7. Return results
    return NextResponse.json({
      success: true,
      dryRun,
      message: dryRun 
        ? 'Dry run completed - no changes made. Set dryRun=false to apply changes.'
        : 'Roles updated successfully',
      changes,
      summary,
      performedBy: session.user.email,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error fixing user roles:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fix user roles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET method for checking current status
export async function GET(request: NextRequest) {
  try {
    // Authentication Check
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // Define expected roles
    const expectedRoles = {
      STUDENT: [
        'joesive47@gmail.com',
        'student1@example.com',
        'student2@example.com',
        'jss.siriwut@gmail.com',
        'student.demo@skillnexus.com',
        'learner1@skillnexus.com',
        'learner2@skillnexus.com',
        'learner3@skillnexus.com',
      ],
      TEACHER: [
        'teacher@example.com',
        'teacher@skillnexus.com',
        'instructor@skillnexus.com',
        'tutor@skillnexus.com',
      ],
      ADMIN: [
        'admin@skillnexus.com',
        'admin@bizsolve-ai.com',
        'admin@example.com',
      ],
    }

    const allEmails = [
      ...expectedRoles.STUDENT,
      ...expectedRoles.TEACHER,
      ...expectedRoles.ADMIN,
    ]

    // Get current users
    const users = await prisma.user.findMany({
      where: {
        email: { in: allEmails },
      },
      select: {
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
      orderBy: { role: 'asc' },
    })

    // Check status
    const status = users.map(user => {
      let expectedRole: string | null = null

      if (expectedRoles.STUDENT.includes(user.email)) {
        expectedRole = 'STUDENT'
      } else if (expectedRoles.TEACHER.includes(user.email)) {
        expectedRole = 'TEACHER'
      } else if (expectedRoles.ADMIN.includes(user.email)) {
        expectedRole = 'ADMIN'
      }

      return {
        email: user.email,
        name: user.name,
        currentRole: user.role,
        expectedRole,
        isCorrect: user.role === expectedRole,
        updatedAt: user.updatedAt,
      }
    })

    const incorrect = status.filter(s => !s.isCorrect)

    return NextResponse.json({
      success: true,
      totalUsers: status.length,
      correctRoles: status.length - incorrect.length,
      incorrectRoles: incorrect.length,
      needsFix: incorrect.length > 0,
      users: status,
      incorrectUsers: incorrect,
    })

  } catch (error) {
    console.error('Error checking user roles:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check user roles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
