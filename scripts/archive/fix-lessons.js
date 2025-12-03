import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixLessons() {
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

    const module1 = course.modules[0]
    const module2 = course.modules[1]

    // Check if lessons already exist for this course
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: courseId }
    })

    if (existingLessons.length > 0) {
      console.log('Updating existing lessons...')
      
      // Update existing lessons to associate with modules
      for (const lesson of existingLessons) {
        let moduleId = null
        if (lesson.order <= 2) {
          moduleId = module1.id
        } else {
          moduleId = module2.id
        }
        
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: { moduleId: moduleId }
        })
        
        console.log(`Updated lesson ${lesson.order}: ${lesson.title} -> Module ${lesson.order <= 2 ? 1 : 2}`)
      }
    } else {
      console.log('Creating new lessons...')
      
      // Create sample quiz first
      const quiz = await prisma.quiz.create({
        data: {
          title: 'Programming Basics Quiz',
          courseId: courseId,
          questions: {
            create: [
              {
                text: 'What is a variable in programming?',
                options: {
                  create: [
                    { text: 'A storage location for data', isCorrect: true },
                    { text: 'A function that returns a value', isCorrect: false },
                    { text: 'A loop structure', isCorrect: false },
                    { text: 'A conditional statement', isCorrect: false },
                  ]
                }
              },
              {
                text: 'Which of the following is a programming language?',
                options: {
                  create: [
                    { text: 'HTML', isCorrect: false },
                    { text: 'CSS', isCorrect: false },
                    { text: 'JavaScript', isCorrect: true },
                    { text: 'JSON', isCorrect: false },
                  ]
                }
              }
            ]
          }
        }
      })

      // Create lessons
      await prisma.lesson.createMany({
        data: [
          {
            title: 'Introduction Video',
            courseId: courseId,
            lessonType: 'VIDEO',
            youtubeUrl: 'https://youtu.be/rfscVS0vtbw',
            duration: 300,
            requiredCompletionPercentage: 80,
            order: 1,
            moduleId: module1.id,
          },
          {
            title: 'Programming Basics Quiz',
            courseId: courseId,
            lessonType: 'QUIZ',
            quizId: quiz.id,
            order: 2,
            moduleId: module1.id,
          },
          {
            title: 'Advanced Concepts',
            courseId: courseId,
            lessonType: 'VIDEO',
            youtubeUrl: 'https://youtu.be/8aGhZQkoFbQ',
            duration: 600,
            requiredCompletionPercentage: 80,
            order: 3,
            moduleId: module2.id,
          },
        ],
      })
      
      console.log('Created new lessons')
    }

    // Also publish the course
    await prisma.course.update({
      where: { id: courseId },
      data: { published: true }
    })

    console.log('Course published and lessons fixed!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixLessons()