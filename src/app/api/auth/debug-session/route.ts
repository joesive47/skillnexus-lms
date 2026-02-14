import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    
    console.log('[DEBUG SESSION] Full session object:', JSON.stringify(session, null, 2))
    console.log('[DEBUG SESSION] User:', session?.user)
    console.log('[DEBUG SESSION] User role:', session?.user?.role)
    console.log('[DEBUG SESSION] User role type:', typeof session?.user?.role)
    
    return NextResponse.json({
      session,
      user: session?.user,
      role: session?.user?.role,
      hasSession: !!session,
      hasUser: !!session?.user,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[DEBUG SESSION] Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
