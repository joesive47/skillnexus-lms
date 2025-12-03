import { NextRequest, NextResponse } from 'next/server'
import { handleGoogleSSO } from '@/lib/auth/google-sso'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json()
    
    const userData = await handleGoogleSSO(profile)
    
    let user = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: '',
          role: 'STUDENT',
          credits: 1000,
        }
      })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Google SSO error:', error)
    return NextResponse.json({ error: 'SSO failed' }, { status: 500 })
  }
}
