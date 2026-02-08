import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const nodeId = params.nodeId

    const node = await prisma.learningNode.findUnique({
      where: { id: nodeId },
      include: {
        dependenciesFrom: true,
        dependenciesTo: true,
        progress: {
          where: { userId: session.user.id }
        }
      }
    })

    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 })
    }

    return NextResponse.json(node)
  } catch (error) {
    console.error('Error fetching node:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
