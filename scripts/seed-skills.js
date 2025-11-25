import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSkills() {
  const skills = [
    {
      name: 'JavaScript',
      description: 'Programming language for web development'
    },
    {
      name: 'React',
      description: 'JavaScript library for building user interfaces'
    },
    {
      name: 'Node.js',
      description: 'JavaScript runtime for server-side development'
    },
    {
      name: 'HTML/CSS',
      description: 'Markup and styling languages for web pages'
    },
    {
      name: 'Database Design',
      description: 'Designing and managing databases'
    },
    {
      name: 'API Development',
      description: 'Creating and consuming web APIs'
    }
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill
    })
  }

  console.log('Skills seeded successfully')
}

seedSkills()
  .catch(console.error)
  .finally(() => prisma.$disconnect())