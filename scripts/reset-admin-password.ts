import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { readFileSync } from 'fs'
import { join } from 'path'

// Manually load .env.production
const envPath = join(process.cwd(), '.env.production')
const envContent = readFileSync(envPath, 'utf-8')

const lines = envContent.split('\n')
for (const line of lines) {
  const trimmed = line.trim()
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [key, ...valueParts] = trimmed.split('=')
    const value = valueParts.join('=').replace(/^["']|["']$/g, '')
    process.env[key.trim()] = value
  }
}

console.log('📁 Loaded environment from .env.production')

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.production!')
  process.exit(1)
}

console.log(' DATABASE_URL found (length:', process.env.DATABASE_URL.length, 'chars)')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    console.log('🔄 Connecting to database...')
    
    const email = 'admin@skillnexus.com'
    const newPassword = 'admin@123!'
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    })
    
    if (!user) {
      console.error('❌ User not found:', email)
      process.exit(1)
    }
    
    console.log('\n📋 Current User Info:')
    console.log('  ID:', user.id)
    console.log('  Email:', user.email)
    console.log('  Name:', user.name)
    console.log('  Role:', user.role)
    console.log('  Current Hash:', user.password.substring(0, 30) + '...')
    console.log('  Hash Length:', user.password.length)
    console.log('  Is Bcrypt:', user.password.startsWith('$2b$') || user.password.startsWith('$2a$'))
    
    if (user.password.startsWith('$2')) {
      const rounds = user.password.substring(4, 6)
      console.log('  Bcrypt Rounds:', rounds)
    }
    
    console.log('\n🔐 Generating new password hash...')
    const hashedPassword = await hash(newPassword, 12)
    console.log('  New Hash:', hashedPassword.substring(0, 30) + '...')
    console.log('  Hash Length:', hashedPassword.length)
    
    console.log('\n💾 Updating password...')
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    })
    
    console.log('\n✅ Password updated successfully!')
    console.log('  Email:', updatedUser.email)
    console.log('  Updated At:', updatedUser.updatedAt)
    console.log('\n🎯 You can now login with:')
    console.log('  Email:', email)
    console.log('  Password:', newPassword)
    
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
