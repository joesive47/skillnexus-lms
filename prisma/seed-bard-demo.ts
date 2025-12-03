import { PrismaClient } from '@prisma/client'
import { createHmac, randomBytes } from 'crypto'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding BARD Certificate demo data...')

  // Find or create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'student@skillnexus.com' },
    update: {},
    create: {
      email: 'student@skillnexus.com',
      password: '$2a$10$YourHashedPasswordHere',
      name: 'Demo Student',
      role: 'STUDENT',
      credits: 1000
    }
  })

  // Find or create demo course
  const demoCourse = await prisma.course.upsert({
    where: { id: 'demo-course-1' },
    update: {},
    create: {
      id: 'demo-course-1',
      title: 'Full Stack Web Development',
      description: 'Complete course on modern web development',
      price: 2999,
      published: true
    }
  })

  // Create BARD certificate
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  const certNumber = `BARD-${year}-TH-${timestamp}`
  const verificationToken = randomBytes(16).toString('hex')

  const bardData = {
    competencies: [
      {
        category: 'BEHAVIORAL',
        skillName: 'Problem Solving',
        level: 4,
        scorePercentage: 85,
        confidenceScore: 0.9
      },
      {
        category: 'APTITUDE',
        skillName: 'Logical Thinking',
        level: 5,
        scorePercentage: 92,
        confidenceScore: 0.95
      },
      {
        category: 'ROLE_SPECIFIC',
        skillName: 'Web Development',
        level: 4,
        scorePercentage: 88,
        confidenceScore: 0.85
      },
      {
        category: 'DEVELOPMENT',
        skillName: 'Continuous Learning',
        level: 5,
        scorePercentage: 95,
        confidenceScore: 0.92
      }
    ],
    careerReadiness: {
      fitScore: 90,
      readinessLevel: 5,
      skillGaps: [
        { skill: 'Advanced Architecture', currentLevel: 3, targetLevel: 5 }
      ],
      suggestedCareers: [
        { title: 'Full Stack Developer', matchPercentage: 92 },
        { title: 'Frontend Developer', matchPercentage: 88 },
        { title: 'Backend Developer', matchPercentage: 85 }
      ]
    }
  }

  const signature = createHmac('sha256', 'demo-key')
    .update(JSON.stringify(bardData))
    .digest('hex')

  const verifyUrl = `http://localhost:3000/bard-verify/${verificationToken}`
  const qrCodeUrl = await QRCode.toDataURL(verifyUrl)

  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 3)

  await prisma.certificate.create({
    data: {
      certificateNumber: certNumber,
      userId: demoUser.id,
      courseId: demoCourse.id,
      verificationToken,
      digitalSignature: signature,
      qrCodeUrl,
      bardData: JSON.stringify(bardData),
      expiresAt,
      status: 'ACTIVE'
    }
  })

  console.log('✅ BARD Certificate demo created successfully!')
  console.log(`📧 User: ${demoUser.email}`)
  console.log(`📚 Course: ${demoCourse.title}`)
  console.log(`🎓 Certificate: ${certNumber}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
