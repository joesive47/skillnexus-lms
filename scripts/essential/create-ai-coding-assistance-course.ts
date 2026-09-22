import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: '.env.production' })

const prisma = new PrismaClient()

const courseTitle = 'AI Coding Assistance: เปลี่ยนแนวคิดเป็นนวัตกรรมด้วย AI'
const quizTitle = 'Final Assessment: AI Coding Assistance'

async function main() {
  const result = await prisma.$transaction(async (tx) => {
    const [existingCourse, quiz, category, admin] = await Promise.all([
      tx.course.findFirst({ where: { title: courseTitle }, select: { id: true } }),
      tx.quiz.findFirst({
        where: { title: quizTitle },
        select: { id: true, courseId: true, _count: { select: { questions: true } } },
      }),
      tx.courseCategory.findUnique({
        where: { slug: 'ai-automation-agents' },
        select: { id: true },
      }),
      tx.user.findFirst({
        where: { email: 'admin@test.local', role: 'ADMIN' },
        select: { id: true },
      }),
    ])

    if (existingCourse) throw new Error('Course already exists; no changes made')
    if (!quiz || quiz.courseId || quiz._count.questions !== 20) {
      throw new Error('Expected an unassigned imported quiz with exactly 20 questions')
    }
    if (!category) throw new Error('AI Automation & Agents category is missing')
    if (!admin) throw new Error('Designated course administrator is missing')

    const course = await tx.course.create({
      data: {
        title: courseTitle,
        description: 'เปลี่ยนโจทย์ธุรกิจให้เป็นต้นแบบดิจิทัลด้วย AI Coding Assistant ผ่าน Prompt, Plan และ Verify อย่างเป็นมืออาชีพ',
        price: 0,
        published: true,
        hasCertificate: true,
        categoryId: category.id,
        instructorId: admin.id,
      },
    })

    const module = await tx.module.create({
      data: { courseId: course.id, title: 'จากแนวคิดสู่ต้นแบบด้วย AI', order: 1 },
    })

    const scormLesson = await tx.lesson.create({
      data: {
        courseId: course.id,
        moduleId: module.id,
        order: 1,
        title: 'Interactive SCORM: จากแนวคิดสู่ต้นแบบด้วย AI',
        type: 'SCORM',
        lessonType: 'SCORM',
        duration: 30 * 60,
        requiredCompletionPercentage: 80,
      },
    })

    const quizLesson = await tx.lesson.create({
      data: {
        courseId: course.id,
        moduleId: module.id,
        order: 2,
        title: quizTitle,
        type: 'QUIZ',
        lessonType: 'QUIZ',
        quizId: quiz.id,
        isFinalExam: true,
        requiredCompletionPercentage: 80,
      },
    })

    await tx.quiz.update({
      where: { id: quiz.id },
      data: {
        courseId: course.id,
        questionPoolSize: 20,
        questionsToShow: 20,
        timeLimit: 25,
        passScore: 80,
        randomize: true,
        shuffleOptions: true,
      },
    })

    const scormNode = await tx.learningNode.create({
      data: {
        courseId: course.id,
        nodeType: 'SCORM',
        refId: scormLesson.id,
        title: scormLesson.title || 'Interactive SCORM',
        order: 10,
        requiredProgress: 0.8,
      },
    })
    const quizNode = await tx.learningNode.create({
      data: {
        courseId: course.id,
        nodeType: 'QUIZ',
        refId: quiz.id,
        title: quizLesson.title || quizTitle,
        order: 20,
        requiredScore: 80,
        isFinalExam: true,
      },
    })
    await tx.nodeDependency.create({
      data: { fromNodeId: scormNode.id, toNodeId: quizNode.id, dependencyType: 'AND' },
    })

    return { courseId: course.id, scormLessonId: scormLesson.id, quizLessonId: quizLesson.id, quizId: quiz.id }
  }, { maxWait: 10_000, timeout: 30_000 })

  console.log(JSON.stringify({ created: true, ...result }, null, 2))
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
