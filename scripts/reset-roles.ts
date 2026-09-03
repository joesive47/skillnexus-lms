import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDefaultRoles() {
  console.log('🔧 Resetting user roles...\n')
  
  try {
    // List of emails that should be ADMIN
    const adminEmails = [
      'admin@skillnexus.com',
      'admin@bizsolve-ai.com',
      'admin@example.com',
      'admin@uppowerskill.com',
      'taweesak@skillnexus.com'
    ]
    
    // List of emails that should be TEACHER
    const teacherEmails = [
      'teacher@skillnexus.com',
      'teacher@example.com',
      'instructor@skillnexus.com',
      'tutor@skillnexus.com'
    ]
    
    // Fix ADMIN users
    console.log('👑 Fixing ADMIN users...')
    for (const email of adminEmails) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (user && user.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' }
        })
        console.log(`  ✅ ${email} → ADMIN`)
      }
    }
    
    // Fix TEACHER users
    console.log('\n👨‍🏫 Fixing TEACHER users...')
    for (const email of teacherEmails) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (user && user.role !== 'TEACHER') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'TEACHER' }
        })
        console.log(`  ✅ ${email} → TEACHER`)
      }
    }
    
    // Check for any users with NULL or invalid roles
    console.log('\n⚠️  Checking for invalid roles...')
    const invalidUsers = await prisma.user.findMany({
      where: {
        role: {
          notIn: ['ADMIN', 'TEACHER', 'STUDENT']
        }
      }
    })
    
    if (invalidUsers.length > 0) {
      console.log(`Found ${invalidUsers.length} users with invalid roles`)
      for (const user of invalidUsers) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'STUDENT' }
        })
        console.log(`  ✅ ${user.email} (was "${user.role}") → STUDENT`)
      }
    } else {
      console.log('No invalid roles found ✓')
    }
    
    // Final check
    console.log('\n📊 Final role distribution:')
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    const teacherCount = await prisma.user.count({ where: { role: 'TEACHER' } })
    const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } })
    
    console.log(`  👑 ADMIN: ${adminCount}`)
    console.log(`  👨‍🏫 TEACHER: ${teacherCount}`)
    console.log(`  👨‍🎓 STUDENT: ${studentCount}`)
    console.log(`  Total: ${adminCount + teacherCount + studentCount}`)
    
    console.log('\n✅ Role reset complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetDefaultRoles()
