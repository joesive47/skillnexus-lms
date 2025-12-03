import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const certNumber = 'BARD-2025-TH-5056670'
  
  console.log('Testing certificate lookup...')
  console.log('Certificate Number:', certNumber)
  
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: certNumber },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true } }
    }
  })

  if (certificate) {
    console.log('✅ Certificate found!')
    console.log('User:', certificate.user.name)
    console.log('Course:', certificate.course.title)
    console.log('Has bardData:', !!certificate.bardData)
  } else {
    console.log('❌ Certificate not found')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
