import { NextRequest, NextResponse } from 'next/server'
import { handleSAMLProfile, validateSAMLConfig } from '@/lib/auth/saml-handler'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    validateSAMLConfig()
    
    const { profile } = await req.json()
    
    const userData = await handleSAMLProfile(profile)
    
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
    console.error('SAML SSO error:', error)
    return NextResponse.json({ error: 'SAML SSO failed' }, { status: 500 })
  }
}
