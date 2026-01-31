import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixPrices() {
  console.log('🔧 Fixing course prices...')
  
  const courses = await prisma.course.findMany({
    where: {
      price: {
        gt: 10000 // Find prices that look like they're in cents (> 10000)
      }
    }
  })
  
  console.log(`Found ${courses.length} courses with incorrect prices`)
  
  for (const course of courses) {
    const newPrice = Math.round(course.price / 100)
    console.log(`Fixing ${course.title}: ${course.price} → ${newPrice}`)
    
    await prisma.course.update({
      where: { id: course.id },
      data: { price: newPrice }
    })
  }
  
  console.log('✅ Done!')
}

fixPrices()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
