import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixRoles() {
  console.log('🔍 Checking user roles...\n')
  
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`📊 Total users: ${users.length}\n`)
    
    // Count by role
    const adminCount = users.filter(u => u.role === 'ADMIN').length
    const teacherCount = users.filter(u => u.role === 'TEACHER').length
    const studentCount = users.filter(u => u.role === 'STUDENT').length
    const otherCount = users.filter(u => !['ADMIN', 'TEACHER', 'STUDENT'].includes(u.role)).length
    
    console.log('Role distribution:')
    console.log(`  👑 ADMIN: ${adminCount}`)
    console.log(`  👨‍🏫 TEACHER: ${teacherCount}`)
    console.log(`  👨‍🎓 STUDENT: ${studentCount}`)
    console.log(`  ❓ OTHER: ${otherCount}\n`)
    
    // Show first 20 users
    console.log('Recent users:')
    users.slice(0, 20).forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.email} - ${u.role} (ID: ${u.id.substring(0, 8)}...)`)
    })
    
    // Check for issues
    if (otherCount > 0) {
      console.log('\n⚠️  Found users with invalid roles!')
      users.filter(u => !['ADMIN', 'TEACHER', 'STUDENT'].includes(u.role)).forEach(u => {
        console.log(`  - ${u.email}: "${u.role}"`)
      })
    }
    
    if (adminCount > 10) {
      console.log('\n⚠️  WARNING: Unusually high number of ADMIN users!')
    }
    
    console.log('\n✅ Role audit complete')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixRoles()
