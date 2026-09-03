const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Create admin users
  const hashedPassword = await bcrypt.hash('Admin@123!', 12)
  
  await prisma.user.upsert({
    where: { email: 'admin@skillnexus.com' },
    update: {},
    create: {
      email: 'admin@skillnexus.com',
      password: hashedPassword,
      name: 'SkillNexus Admin',
      role: 'ADMIN',
    },
  })

  // Create student with credits
  const studentPassword = await bcrypt.hash('Student@123!', 12)
  await prisma.user.upsert({
    where: { email: 'student@skillnexus.com' },
    update: { credits: 1000 },
    create: {
      email: 'student@skillnexus.com',
      password: studentPassword,
      name: 'Demo Student',
      role: 'STUDENT',
      credits: 1000,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })