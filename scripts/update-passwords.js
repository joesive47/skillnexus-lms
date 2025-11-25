const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function updatePasswords() {
  try {
    console.log('🔐 Updating user passwords to meet new security requirements...')
    
    // New strong passwords
    const passwordUpdates = [
      { email: 'admin@skillnexus.com', password: 'Admin@123!' },
      { email: 'admin@bizsolve-ai.com', password: 'Admin@123!' },
      { email: 'teacher@skillnexus.com', password: 'Teacher@123!' },
      { email: 'student@skillnexus.com', password: 'Student@123!' },
      { email: 'john@example.com', password: 'Student@123!' },
      { email: 'alice@example.com', password: 'Student@123!' },
      { email: 'joesive47@gmail.com', password: 'Student@123!' }
    ]

    for (const update of passwordUpdates) {
      const hashedPassword = await bcrypt.hash(update.password, 12)
      
      await prisma.user.updateMany({
        where: { email: update.email },
        data: { password: hashedPassword }
      })
      
      console.log(`✅ Updated password for ${update.email}`)
    }

    // Update any remaining users with weak passwords
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true }
    })

    for (const user of allUsers) {
      if (!passwordUpdates.find(p => p.email === user.email)) {
        const hashedPassword = await bcrypt.hash('Student@123!', 12)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        })
        console.log(`✅ Updated password for ${user.email}`)
      }
    }

    console.log('🎉 All passwords updated successfully!')
    console.log('📋 New password requirements:')
    console.log('   - Minimum 8 characters')
    console.log('   - At least 1 uppercase letter')
    console.log('   - At least 1 lowercase letter') 
    console.log('   - At least 1 number')
    console.log('   - At least 1 special character (@$!%*?&)')
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePasswords()