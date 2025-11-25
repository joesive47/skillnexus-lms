import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedLearningPaths() {
  console.log('🌱 Seeding learning paths...')

  try {
    // Create sample careers if they don't exist
    const existingCareer1 = await prisma.career.findFirst({ where: { title: 'Full-Stack Developer' } })
    const existingCareer2 = await prisma.career.findFirst({ where: { title: 'Data Scientist' } })
    
    if (!existingCareer1) {
      await prisma.career.create({
        data: {
          title: 'Full-Stack Developer',
          description: 'Build complete web applications from frontend to backend',
          category: 'Software Development'
        }
      })
    }
    
    if (!existingCareer2) {
      await prisma.career.create({
        data: {
          title: 'Data Scientist',
          description: 'Analyze data and build machine learning models',
          category: 'Data & Analytics'
        }
      })
    }

    // Get career IDs
    const fullStackCareer = await prisma.career.findFirst({
      where: { title: 'Full-Stack Developer' }
    })
    const dataScientistCareer = await prisma.career.findFirst({
      where: { title: 'Data Scientist' }
    })

    // Create sample learning paths
    const fullStackPath = await prisma.learningPath.create({
      data: {
        title: 'Complete Full-Stack Developer Journey',
        description: 'Master frontend and backend development with modern technologies',
        careerId: fullStackCareer?.id,
        difficulty: 'INTERMEDIATE',
        estimatedHours: 120,
        isPublic: true,
        tags: JSON.stringify(['javascript', 'react', 'nodejs', 'database'])
      }
    })

    // Add steps to Full-Stack path
    await prisma.learningPathStep.createMany({
      data: [
        {
          pathId: fullStackPath.id,
          order: 1,
          title: 'HTML & CSS Fundamentals',
          description: 'Learn the building blocks of web development',
          type: 'COURSE',
          estimatedHours: 15,
          isRequired: true,
          points: 100
        },
        {
          pathId: fullStackPath.id,
          order: 2,
          title: 'JavaScript Essentials',
          description: 'Master JavaScript programming language',
          type: 'COURSE',
          estimatedHours: 25,
          isRequired: true,
          points: 150
        },
        {
          pathId: fullStackPath.id,
          order: 3,
          title: 'React Development',
          description: 'Build modern user interfaces with React',
          type: 'COURSE',
          estimatedHours: 30,
          isRequired: true,
          points: 200
        }
      ]
    })

    console.log('✅ Learning paths seeded successfully!')
    console.log(`Created path: ${fullStackPath.title} (${fullStackPath.id})`)

  } catch (error) {
    console.error('❌ Error seeding learning paths:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedLearningPaths()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })