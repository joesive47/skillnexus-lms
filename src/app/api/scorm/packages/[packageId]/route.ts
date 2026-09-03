import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { promises as fs } from 'fs'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { packageId } = await params

    // If packageId is actually a lessonId, find by lessonId
    let scormPackage = await prisma.scormPackage.findUnique({
      where: { id: packageId },
      include: { lesson: true }
    })

    // If not found, try finding by lessonId
    if (!scormPackage) {
      scormPackage = await prisma.scormPackage.findUnique({
        where: { lessonId: packageId },
        include: { lesson: true }
      })
    }

    if (!scormPackage) {
      return NextResponse.json({ error: 'SCORM package not found' }, { status: 404 })
    }

    return NextResponse.json({ package: scormPackage })
  } catch (error) {
    console.error('Error fetching SCORM package:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SCORM package' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { packageId } = await params

    // Find the SCORM package
    const scormPackage = await prisma.scormPackage.findUnique({
      where: { id: packageId }
    })

    if (!scormPackage) {
      return NextResponse.json({ error: 'SCORM package not found' }, { status: 404 })
    }

    // Delete physical files
    try {
      const packageDir = join(process.cwd(), 'public', scormPackage.packagePath)
      await fs.rm(packageDir, { recursive: true, force: true })
    } catch (fileError) {
      console.warn('Failed to delete SCORM files:', fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.scormPackage.delete({
      where: { id: packageId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting SCORM package:', error)
    return NextResponse.json(
      { error: 'Failed to delete SCORM package' },
      { status: 500 }
    )
  }
}