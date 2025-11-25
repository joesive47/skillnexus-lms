import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addQuizLesson() {
  try {
    const courseId = 'cmhivzf9h0004giz3flhpzjr7'
    
    // Get course and modules
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!course || course.modules.length === 0) {
      console.log('Course or modules not found')
      return
    }

    const module2 = course.modules[1] // Advanced Topics module

    // Create a quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Advanced Programming Quiz',
        courseId: courseId,
        questions: {
          create: [
            {
              text: 'What is object-oriented programming?',
              options: {
                create: [
                  { text: 'A programming paradigm based on objects', isCorrect: true },
                  { text: 'A type of database', isCorrect: false },
                  { text: 'A web framework', isCorrect: false },
                  { text: 'A testing methodology', isCorrect: false },
                ]
              }
            },
            {
              text: 'Which principle is NOT part of OOP?',
              options: {
                create: [
                  { text: 'Encapsulation', isCorrect: false },
                  { text: 'Inheritance', isCorrect: false },
                  { text: 'Polymorphism', isCorrect: false },
                  { text: 'Compilation', isCorrect: true },
                ]
              }
            }
          ]
        }
      }
    })

    // Create quiz lesson
    await prisma.lesson.create({
      data: {
        title: 'Advanced Programming Quiz',
        courseId: courseId,
        lessonType: 'QUIZ',
        quizId: quiz.id,
        order: 3,
        moduleId: module2.id,
        requiredCompletionPercentage: 80,
      }
    })

    console.log('Quiz lesson added to Module 2!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addQuizLesson()