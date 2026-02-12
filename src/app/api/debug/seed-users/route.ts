import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting user seeding...')
    
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
    
    const results = []
    
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
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      results.push({
        ...user,
        passwordPlainText: userData.password,
        passwordHash: hashedPassword.substring(0, 20) + '...'
      })
      
      console.log(`   ✅ ${user.email} - ${user.role}`)
    }
    
    // Count total users
    const totalUsers = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: 'Users seeded successfully',
      users: results,
      totalUsersInDatabase: totalUsers,
      loginInfo: [
        {
          role: 'ADMIN',
          email: 'admin@skillnexus.com',
          password: 'Admin@123!'
        },
        {
          role: 'TEST USER',
          email: 'test@uppowerskill.com',
          password: 'test1234'
        },
        {
          role: 'INSTRUCTOR',
          email: 'instructor@uppowerskill.com',
          password: 'instructor123'
        }
      ]
    })
  } catch (error: any) {
    console.error('❌ Seed users error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to seed users',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}

// GET endpoint to show what users would be seeded (without actually seeding)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Send POST request to seed users',
    users: [
      {
        role: 'ADMIN',
        email: 'admin@skillnexus.com',
        password: 'Admin@123!',
        name: 'นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)'
      },
      {
        role: 'TEST USER',
        email: 'test@uppowerskill.com',
        password: 'test1234',
        name: 'Test User'
      },
      {
        role: 'INSTRUCTOR',
        email: 'instructor@uppowerskill.com',
        password: 'instructor123',
        name: 'Instructor User'
      }
    ],
    note: 'These users will be created or updated with new passwords when you POST to this endpoint'
  })
}
