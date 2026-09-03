/**
 * Script to add credits to a user account
 * Usage: node scripts/add-credits.js <email> <amount>
 * Example: node scripts/add-credits.js joesive47@gmail.com 10000
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addCredits() {
  try {
    const email = process.argv[2]
    const amount = parseInt(process.argv[3])

    if (!email || !amount || isNaN(amount)) {
      console.error('❌ Usage: node scripts/add-credits.js <email> <amount>')
      console.error('   Example: node scripts/add-credits.js joesive47@gmail.com 10000')
      process.exit(1)
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true
      }
    })

    if (!user) {
      console.error(`❌ User not found: ${email}`)
      process.exit(1)
    }

    const oldCredits = user.credits
    const newCredits = oldCredits + amount

    // Update credits and create transaction record
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: newCredits }
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: 'CREDIT_ADD',
          amount: amount,
          description: `Admin added ${amount} credits`
        }
      })
    ])

    console.log('✅ Credits added successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`👤 User: ${user.name || 'N/A'} (${user.email})`)
    console.log(`💰 Old Credits: ${oldCredits.toLocaleString('th-TH')}`)
    console.log(`➕ Added: +${amount.toLocaleString('th-TH')}`)
    console.log(`💎 New Credits: ${newCredits.toLocaleString('th-TH')}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
  } catch (error) {
    console.error('❌ Error adding credits:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addCredits()
