import { NextRequest, NextResponse } from 'next/server'
import { PasswordValidator } from '@/lib/security/password-validator'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const validation = PasswordValidator.validate(password)
  const breached = await PasswordValidator.checkBreach(password)

  return NextResponse.json({
    ...validation,
    breached,
    warning: breached ? 'This password has been exposed in a data breach' : null
  })
}
