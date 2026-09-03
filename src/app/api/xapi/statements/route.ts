import { NextRequest, NextResponse } from 'next/server'
import { AccessError, publicError, requireUser } from '@/lib/access-control'

// Temporary xAPI implementation - stores statements in memory for demo
type XapiStatement = {
  id: string
  actorName: string
  actorEmail: string
  verbId: string
  verbDisplay: Record<string, string>
  objectId: string
  objectName: Record<string, string>
  result: unknown
  timestamp: Date
  rawStatement: unknown
}

const xapiStatements: XapiStatement[] = []

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const statement = await request.json()
    
    // Store xAPI statement in memory (for demo purposes)
    const processedStatement = {
      id: Date.now().toString(),
      actorName: user.email,
      actorEmail: user.email,
      verbId: statement.verb?.id || 'experienced',
      verbDisplay: statement.verb?.display || { 'en-US': 'experienced' },
      objectId: statement.object?.id || 'unknown',
      objectName: statement.object?.definition?.name || { 'en-US': 'Unknown Activity' },
      result: statement.result || null,
      timestamp: new Date(statement.timestamp || Date.now()),
      rawStatement: statement
    }
    
    xapiStatements.push(processedStatement)
    
    // Keep only last 1000 statements
    if (xapiStatements.length > 1000) {
      xapiStatements.shift()
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('xAPI Statement error:', error)
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const { searchParams } = new URL(request.url)
    const actor = user.role === 'ADMIN' ? searchParams.get('actor') : user.email
    const verb = searchParams.get('verb')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredStatements = xapiStatements
    
    if (actor) {
      const actorEmail = actor.replace('mailto:', '')
      filteredStatements = filteredStatements.filter(s => s.actorEmail === actorEmail)
    }
    
    if (verb) {
      filteredStatements = filteredStatements.filter(s => s.verbId === verb)
    }

    const statements = filteredStatements
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    return NextResponse.json({ statements })
  } catch (error) {
    console.error('xAPI Get statements error:', error)
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
