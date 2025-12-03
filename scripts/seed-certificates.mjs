import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { createHmac, randomBytes } from 'crypto'

const { hash } = bcryptjs

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding certificates...')

  // Create student user
  const hashedPassword = await hash('student123', 10)
  
  const student = await prisma.user.upsert({
    where: { email: 'excellent@student.com' },
    update: {},
    create: {
      email: 'excellent@student.com',
      name: 'นางสาวเก่งมาก เรียนดี',
      password: hashedPassword,
      role: 'STUDENT',
      credits: 5000
    }
  })

  console.log('✅ Created student:', student.email)

  // Get existing courses or use first 3 courses
  let courses = await prisma.course.findMany({ take: 3 })
  
  if (courses.length === 0) {
    // Create demo courses if none exist
    courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Full Stack Web Development Bootcamp',
          description: 'Complete bootcamp covering frontend and backend',
          price: 2999,
          published: true
        }
      }),
      prisma.course.create({
        data: {
          title: 'React & Next.js Mastery',
          description: 'Master modern React and Next.js',
          price: 1999,
          published: true
        }
      }),
      prisma.course.create({
        data: {
          title: 'Python Data Science Professional',
          description: 'Complete Python data science course',
          price: 2499,
          published: true
        }
      })
    ])
  }

  console.log('✅ Created courses')

  // Create certificates
  const certificates = []
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i]
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6) + i
    const certNumber = `BARD-${year}-TH-${timestamp}`
    const verificationToken = randomBytes(16).toString('hex')
    
    const bardData = {
      competencies: {
        behavioral: { score: 88 + i * 2, level: 4 + (i === 2 ? 1 : 0) },
        aptitude: { score: 90 + i, level: 5 },
        roleSpecific: { score: 85 + i * 3, level: 4 },
        development: { score: 92 - i, level: 5 }
      },
      careerReadiness: {
        fitScore: 88 + i * 2,
        readinessLevel: 4 + (i === 1 ? 1 : 0),
        recommendations: ['Continue learning', 'Build portfolio', 'Apply for jobs']
      }
    }

    const signature = createHmac('sha256', process.env.CERT_SIGNING_KEY || 'default-key')
      .update(JSON.stringify(bardData))
      .digest('hex')

    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 3)

    const cert = await prisma.certificate.create({
      data: {
        certificateNumber: certNumber,
        userId: student.id,
        courseId: course.id,
        verificationToken,
        digitalSignature: signature,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${certNumber}`,
        bardData: JSON.stringify(bardData),
        status: 'ACTIVE',
        expiresAt
      }
    })

    certificates.push(cert)
    console.log(`✅ Created certificate: ${certNumber}`)
  }

  console.log('\n🎉 Seeding completed!')
  console.log('\n📋 Test Account:')
  console.log('Email: excellent@student.com')
  console.log('Password: student123')
  console.log(`\n📜 Certificates created: ${certificates.length}`)
  certificates.forEach(cert => {
    console.log(`  - ${cert.certificateNumber}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
