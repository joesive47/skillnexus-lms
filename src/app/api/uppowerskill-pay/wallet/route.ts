import { NextRequest, NextResponse } from 'next/server'
import { SkillWallet } from '@/lib/uppowerskill-pay/core-engine'

export async function POST(req: NextRequest) {
  const { userId, creditType, amount, purpose } = await req.json()
  
  const wallet = new SkillWallet(userId, {
    learning: 1000,
    exam: 500,
    ai: 200,
    funding: 0
  })

  try {
    const transaction = await wallet.spendCredits(creditType, amount, purpose)
    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  
  return NextResponse.json({
    userId,
    credits: {
      learning: 1000,
      exam: 500,
      ai: 200,
      funding: 0
    },
    status: 'ACTIVE'
  })
}