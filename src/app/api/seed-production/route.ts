import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return NextResponse.json({ message: 'Users already exist', count: existingUsers })
    }

    const hashedPassword = await bcrypt.hash('Admin@123!', 12)

    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@skillnexus.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN',
          credits: 10000,
        }
      }),
      prisma.user.create({
        data: {
          email: 'teacher@skillnexus.com',
          password: hashedPassword,
          name: 'Teacher User',
          role: 'TEACHER',
          credits: 5000,
        }
      }),
      prisma.user.create({
        data: {
          email: 'student@skillnexus.com',
          password: hashedPassword,
          name: 'Student User',
          role: 'STUDENT',
          credits: 1000,
        }
      })
    ])

    return NextResponse.json({ 
      success: true, 
      message: 'Production users created',
      users: users.map(u => ({ email: u.email, role: u.role }))
    })

  } catch (error) {
    console.error('Seed production error:', error)
    return NextResponse.json({ 
      error: 'Failed to seed users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
