import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking certificates in database...\n')

  const certificates = await prisma.certificate.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    }
  })

  console.log(`Found ${certificates.length} certificates:\n`)

  certificates.forEach((cert, index) => {
    console.log(`${index + 1}. Certificate Number: ${cert.certificateNumber}`)
    console.log(`   User: ${cert.user.name} (${cert.user.email})`)
    console.log(`   Course: ${cert.course.title}`)
    console.log(`   Status: ${cert.status}`)
    console.log(`   Download URL: /api/certificates/download/${cert.certificateNumber}`)
    console.log('')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
