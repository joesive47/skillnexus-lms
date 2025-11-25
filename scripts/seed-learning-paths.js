const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedLearningPaths() {
  console.log('🌱 Seeding learning paths...')

  try {
    // Create sample careers if they don't exist
    const careers = await prisma.career.createMany({
      data: [
        {
          title: 'Full-Stack Developer',
          description: 'Build complete web applications from frontend to backend',
          category: 'Software Development'
        },
        {
          title: 'Data Scientist',
          description: 'Analyze data and build machine learning models',
          category: 'Data & Analytics'
        },
        {
          title: 'UI/UX Designer',
          description: 'Design user interfaces and user experiences',
          category: 'Design'
        }
      ],
      skipDuplicates: true
    })

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
        tags: JSON.stringify(['javascript', 'react', 'nodejs', 'database']),
        imageUrl: '/images/fullstack-path.jpg'
      }
    })

    const dataPath = await prisma.learningPath.create({
      data: {
        title: 'Data Science Fundamentals',
        description: 'Learn Python, statistics, and machine learning basics',
        careerId: dataScientistCareer?.id,
        difficulty: 'BEGINNER',
        estimatedHours: 80,
        isPublic: true,
        tags: JSON.stringify(['python', 'statistics', 'machine-learning']),
        imageUrl: '/images/data-science-path.jpg'
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
          points: 150,
          prerequisites: JSON.stringify(['step1'])
        },
        {
          pathId: fullStackPath.id,
          order: 3,
          title: 'React Development',
          description: 'Build modern user interfaces with React',
          type: 'COURSE',
          estimatedHours: 30,
          isRequired: true,
          points: 200,
          prerequisites: JSON.stringify(['step2'])
        },
        {
          pathId: fullStackPath.id,
          order: 4,
          title: 'Node.js Backend',
          description: 'Create server-side applications with Node.js',
          type: 'COURSE',
          estimatedHours: 25,
          isRequired: true,
          points: 200,
          prerequisites: JSON.stringify(['step2'])
        },
        {
          pathId: fullStackPath.id,
          order: 5,
          title: 'Full-Stack Project',
          description: 'Build a complete web application',
          type: 'PROJECT',
          estimatedHours: 25,
          isRequired: false,
          points: 300,
          prerequisites: JSON.stringify(['step3', 'step4'])
        }
      ]
    })

    // Add steps to Data Science path
    await prisma.learningPathStep.createMany({
      data: [
        {
          pathId: dataPath.id,
          order: 1,
          title: 'Python Programming Basics',
          description: 'Learn Python programming fundamentals',
          type: 'COURSE',
          estimatedHours: 20,
          isRequired: true,
          points: 100
        },
        {
          pathId: dataPath.id,
          order: 2,
          title: 'Statistics for Data Science',
          description: 'Understand statistical concepts and methods',
          type: 'COURSE',
          estimatedHours: 15,
          isRequired: true,
          points: 120,
          prerequisites: JSON.stringify(['step1'])
        },
        {
          pathId: dataPath.id,
          order: 3,
          title: 'Data Analysis with Pandas',
          description: 'Manipulate and analyze data using Pandas',
          type: 'COURSE',
          estimatedHours: 20,
          isRequired: true,
          points: 150,
          prerequisites: JSON.stringify(['step1'])
        },
        {
          pathId: dataPath.id,
          order: 4,
          title: 'Machine Learning Basics',
          description: 'Introduction to machine learning algorithms',
          type: 'COURSE',
          estimatedHours: 25,
          isRequired: true,
          points: 200,
          prerequisites: JSON.stringify(['step2', 'step3'])
        }
      ]
    })

    // Create sample skills
    await prisma.skill.createMany({
      data: [
        { name: 'JavaScript', description: 'Programming language for web development' },
        { name: 'Python', description: 'Versatile programming language' },
        { name: 'React', description: 'Frontend JavaScript library' },
        { name: 'Node.js', description: 'JavaScript runtime for backend' },
        { name: 'HTML/CSS', description: 'Markup and styling languages' },
        { name: 'SQL', description: 'Database query language' }
      ],
      skipDuplicates: true
    })

    // Create skill prerequisites
    const jsSkill = await prisma.skill.findFirst({ where: { name: 'JavaScript' } })
    const reactSkill = await prisma.skill.findFirst({ where: { name: 'React' } })
    const htmlSkill = await prisma.skill.findFirst({ where: { name: 'HTML/CSS' } })

    if (jsSkill && reactSkill && htmlSkill) {
      await prisma.skillPrerequisite.createMany({
        data: [
          {
            skillId: reactSkill.id,
            prerequisiteId: jsSkill.id,
            requiredLevel: 2,
            weight: 1.0
          },
          {
            skillId: jsSkill.id,
            prerequisiteId: htmlSkill.id,
            requiredLevel: 1,
            weight: 0.8
          }
        ],
        skipDuplicates: true
      })
    }

    console.log('✅ Learning paths seeded successfully!')
    console.log(`Created paths:`)
    console.log(`- ${fullStackPath.title} (${fullStackPath.id})`)
    console.log(`- ${dataPath.title} (${dataPath.id})`)

  } catch (error) {
    console.error('❌ Error seeding learning paths:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedLearningPaths()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { seedLearningPaths }