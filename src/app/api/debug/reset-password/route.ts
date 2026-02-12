import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and newPassword are required' },
        { status: 400 }
      )
    }

    // Hash the new password with bcrypt (12 rounds)
    const hashedPassword = await hash(newPassword, 12)

    // Update user password
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

    return NextResponse.json({
      success: true,
      message: `Password updated successfully for ${email}`,
      user: updatedUser,
      passwordHash: hashedPassword.substring(0, 20) + '...' // Show first 20 chars only
    })
  } catch (error: any) {
    console.error('❌ Reset password error:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found', email: request.json().then(d => d.email) },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to reset password',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check current password hash
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', email },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        passwordHash: user.password.substring(0, 30) + '...',
        hashLength: user.password.length,
        isBcrypt: user.password.startsWith('$2b$') || user.password.startsWith('$2a$'),
        bcryptRounds: user.password.startsWith('$2') ? user.password.substring(4, 6) : 'N/A'
      }
    })
  } catch (error: any) {
    console.error('❌ Get password info error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get password info',
        details: error.message
      },
      { status: 500 }
    )
  }
}
