import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding BARD skills...')

  const skills = [
    // Behavioral Skills
    { name: 'Problem Solving', category: 'BEHAVIORAL', description: 'Ability to identify and solve complex problems' },
    { name: 'Teamwork', category: 'BEHAVIORAL', description: 'Collaboration and working effectively with others' },
    { name: 'Communication', category: 'BEHAVIORAL', description: 'Clear and effective verbal and written communication' },
    { name: 'Adaptability', category: 'BEHAVIORAL', description: 'Flexibility in changing environments' },
    { name: 'Leadership', category: 'BEHAVIORAL', description: 'Guiding and motivating teams' },

    // Aptitude Skills
    { name: 'Logical Reasoning', category: 'APTITUDE', description: 'Analytical thinking and logic' },
    { name: 'Pattern Recognition', category: 'APTITUDE', description: 'Identifying patterns and trends' },
    { name: 'Numerical Ability', category: 'APTITUDE', description: 'Mathematical and quantitative skills' },
    { name: 'Verbal Reasoning', category: 'APTITUDE', description: 'Language comprehension and reasoning' },
    { name: 'Spatial Awareness', category: 'APTITUDE', description: 'Understanding spatial relationships' },

    // Role-Specific Skills (Full-Stack Developer)
    { name: 'React', category: 'ROLE_SPECIFIC', description: 'Frontend development with React' },
    { name: 'Node.js', category: 'ROLE_SPECIFIC', description: 'Backend development with Node.js' },
    { name: 'Database', category: 'ROLE_SPECIFIC', description: 'Database design and management' },
    { name: 'API Development', category: 'ROLE_SPECIFIC', description: 'RESTful API design and implementation' },
    { name: 'Testing', category: 'ROLE_SPECIFIC', description: 'Unit and integration testing' },

    // Development Skills
    { name: 'Learning Agility', category: 'DEVELOPMENT', description: 'Quick learning and adaptation' },
    { name: 'Self-Direction', category: 'DEVELOPMENT', description: 'Independent work and initiative' },
    { name: 'Growth Mindset', category: 'DEVELOPMENT', description: 'Continuous improvement attitude' },
    { name: 'Resilience', category: 'DEVELOPMENT', description: 'Perseverance through challenges' },
    { name: 'Curiosity', category: 'DEVELOPMENT', description: 'Desire to learn and explore' }
  ]

  for (const skill of skills) {
    await prisma.bARDSkill.upsert({
      where: { name_category: { name: skill.name, category: skill.category as any } },
      update: {},
      create: skill as any
    })
  }

  console.log(`✅ Seeded ${skills.length} BARD skills`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
