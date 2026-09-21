import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: process.env.DEMO_RESET_ENV_FILE || '.env.production' })

const prisma = new PrismaClient()
const applyChanges = process.argv.includes('--apply')
const confirmation = process.env.DEMO_RESET_CONFIRMATION
const testCategorySlug = 'certificate-system-test'

const expectedDemoSnapshot = {
  courses: 19,
  students: 15,
  teachers: 2,
  testCategoryChildren: 1,
} as const

type ResetInventory = {
  courses: number
  students: number
  teachers: number
  nonAdminUsers: number
  testCategoryChildren: number
  testCategoryFound: boolean
  enrollments: number
  lessons: number
  quizzes: number
  certificates: number
}

async function getInventory(): Promise<ResetInventory> {
  const [
    courses,
    students,
    teachers,
    nonAdminUsers,
    testCategory,
    enrollments,
    lessons,
    quizzes,
    certificates,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
    prisma.courseCategory.findUnique({
      where: { slug: testCategorySlug },
      select: { id: true, children: { select: { id: true } } },
    }),
    prisma.enrollment.count(),
    prisma.lesson.count(),
    prisma.quiz.count(),
    prisma.certificate.count(),
  ])

  return {
    courses,
    students,
    teachers,
    nonAdminUsers,
    testCategoryChildren: testCategory?.children.length ?? 0,
    testCategoryFound: Boolean(testCategory),
    enrollments,
    lessons,
    quizzes,
    certificates,
  }
}

function assertExpectedDemoSnapshot(inventory: ResetInventory) {
  const snapshotMatches =
    inventory.courses === expectedDemoSnapshot.courses &&
    inventory.students === expectedDemoSnapshot.students &&
    inventory.teachers === expectedDemoSnapshot.teachers &&
    inventory.nonAdminUsers === expectedDemoSnapshot.students + expectedDemoSnapshot.teachers &&
    inventory.testCategoryFound &&
    inventory.testCategoryChildren === expectedDemoSnapshot.testCategoryChildren

  if (!snapshotMatches) {
    throw new Error(
      'The database no longer matches the approved demo snapshot. No records were changed.'
    )
  }
}

async function resetDemoData() {
  const inventory = await getInventory()
  console.log(JSON.stringify({ mode: applyChanges ? 'APPLY' : 'DRY_RUN', inventory }, null, 2))
  assertExpectedDemoSnapshot(inventory)

  if (!applyChanges) {
    console.log('Dry run complete. Re-run with --apply and DEMO_RESET_CONFIRMATION=reset-demo-data to perform the reset.')
    return
  }

  if (confirmation !== 'reset-demo-data') {
    throw new Error('A matching DEMO_RESET_CONFIRMATION is required. No records were changed.')
  }

  const [courses, demoUsers, testCategory] = await Promise.all([
    prisma.course.findMany({ select: { id: true } }),
    prisma.user.findMany({ where: { role: { not: 'ADMIN' } }, select: { id: true } }),
    prisma.courseCategory.findUnique({ where: { slug: testCategorySlug }, select: { id: true } }),
  ])

  if (!testCategory) {
    throw new Error('The demo category is missing. No records were changed.')
  }

  const courseIds = courses.map((course) => course.id)
  const demoUserIds = demoUsers.map((user) => user.id)
  const courseQuizzes = await prisma.quiz.findMany({
    where: {
      OR: [
        { courseId: { in: courseIds } },
        { lessons: { some: { courseId: { in: courseIds } } } },
      ],
    },
    select: { id: true },
  })
  const courseQuizIds = courseQuizzes.map((quiz) => quiz.id)
  const legacyCertificates = await prisma.certificate.findMany({
    where: { courseId: { in: courseIds } },
    select: { id: true },
  })
  const issuedCourseCertificates = await prisma.courseCertificate.findMany({
    where: { courseId: { in: courseIds } },
    select: { id: true },
  })
  const verificationEntityIds = [
    ...legacyCertificates.map((certificate) => certificate.id),
    ...issuedCourseCertificates.map((certificate) => certificate.id),
  ]

  await prisma.$transaction(async (tx) => {
    // These tables either have no foreign-key relation in the legacy schema or
    // represent aggregate/demo telemetry, so clear them before the cascades.
    await tx.quizSession.deleteMany()
    await tx.paymentWebhookEvent.deleteMany()
    await tx.transaction.deleteMany()
    await tx.payment.deleteMany()
    await tx.analytics.deleteMany()
    await tx.visitorStats.deleteMany()
    await tx.document.deleteMany({ where: { courseId: { in: courseIds } } })
    await tx.apiLog.deleteMany({ where: { userId: { in: demoUserIds } } })
    await tx.securityLog.deleteMany({ where: { userId: { in: demoUserIds } } })
    // Prisma preserves the leading initialism as `aIUsageLog` for the
    // `AIUsageLog` model.
    await tx.aIUsageLog.deleteMany({ where: { userId: { in: demoUserIds } } })
    await tx.certificationEvent.deleteMany({ where: { userId: { in: demoUserIds } } })

    if (verificationEntityIds.length > 0) {
      await tx.verificationRecord.deleteMany({
        where: { entityId: { in: verificationEntityIds } },
      })
    }

    // Break legacy self/cross references before deleting their parent course.
    await tx.lesson.updateMany({
      where: { courseId: { in: courseIds } },
      data: { nextLessonId: null, quizId: null },
    })
    await tx.quiz.deleteMany({ where: { id: { in: courseQuizIds } } })

    const deletedCourses = await tx.course.deleteMany({ where: { id: { in: courseIds } } })
    await tx.courseCategory.deleteMany({ where: { parentId: testCategory.id } })
    await tx.courseCategory.delete({ where: { id: testCategory.id } })
    const deletedUsers = await tx.user.deleteMany({ where: { id: { in: demoUserIds } } })

    console.log(JSON.stringify({ deletedCourses: deletedCourses.count, deletedUsers: deletedUsers.count }))
  }, { maxWait: 5_000, timeout: 60_000 })

  const remaining = await getInventory()
  if (remaining.courses !== 0 || remaining.nonAdminUsers !== 0 || remaining.quizzes !== 0 || remaining.testCategoryFound) {
    throw new Error('Reset completed with unexpected remaining demo records. Investigate before launch.')
  }

  console.log(JSON.stringify({ status: 'COMPLETE', remaining }, null, 2))
}

resetDemoData()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
