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

const prisma = new PrismaClient()

async function seedUsers() {
  try {
    console.log('\n🔄 Connecting to database...\n')
    
    // Users to seed
    const users = [
      {
        email: 'admin@skillnexus.com',
        password: 'Admin@123!',
        name: 'นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)',
        role: 'ADMIN' as const
      },
      {
        email: 'test@uppowerskill.com',
        password: 'test1234',
        name: 'Test User',
        role: 'USER' as const
      },
      {
        email: 'instructor@uppowerskill.com',
        password: 'instructor123',
        name: 'Instructor User',
        role: 'INSTRUCTOR' as const
      }
    ]
    
    console.log('🔐 Hashing passwords and creating users...\n')
    
    for (const userData of users) {
      console.log(`👤 Processing: ${userData.email}`)
      
      // Hash password
      const hashedPassword = await hash(userData.password, 12)
      
      // Upsert user (update if exists, create if not)
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
          updatedAt: new Date()
        },
        create: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
          emailVerified: new Date(), // Set as verified
        }
      })
      
      console.log(`   ✅ ${user.email} - ${user.role}`)
      console.log(`   📧 Email: ${userData.email}`)
      console.log(`   🔑 Password: ${userData.password}`)
      console.log(`   🆔 ID: ${user.id}`)
      console.log()
    }
    
    // Count total users
    const totalUsers = await prisma.user.count()
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Users seeded successfully!')
    console.log(`📊 Total users in database: ${totalUsers}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🎯 You can now login with:')
    console.log('\n1️⃣  ADMIN:')
    console.log('   Email: admin@skillnexus.com')
    console.log('   Password: Admin@123!')
    console.log('\n2️⃣  TEST USER:')
    console.log('   Email: test@uppowerskill.com')
    console.log('   Password: test1234')
    console.log('\n3️⃣  INSTRUCTOR:')
    console.log('   Email: instructor@uppowerskill.com')
    console.log('   Password: instructor123')
    console.log()
    
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedUsers()
