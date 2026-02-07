import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { scormService } from '@/lib/scorm-blob-service'

export async function POST(request: NextRequest) {
  try {
    console.log('📦 SCORM upload API called')
    
    const session = await auth()
    if (!session?.user?.id) {
      console.log('❌ Authentication failed')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      console.log('❌ Admin access required')
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('✅ Authentication successful')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const lessonId = formData.get('lessonId') as string
    const replace = formData.get('replace') === 'true'

    console.log(`📁 File: ${file?.name}, Size: ${file?.size}, Lesson: ${lessonId}, Replace: ${replace}`)

    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!lessonId) {
      console.log('❌ No lesson ID provided')
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith('.zip')) {
      console.log('❌ Invalid file type:', file.name)
      return NextResponse.json({ error: 'Only ZIP files are allowed' }, { status: 400 })
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({ error: 'File size must be less than 50MB' }, { status: 400 })
    }
    
    console.log('✅ File validation passed')

    // If replacing, delete existing package first
    if (replace) {
      try {
        const existingPackage = await scormService.getPackage(lessonId)
        if (existingPackage) {
          // Delete existing package files and database record
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/scorm/packages/${existingPackage.id}`, {
            method: 'DELETE'
          })
        }
      } catch (error) {
        console.warn('Failed to delete existing package:', error)
        // Continue with upload even if deletion fails
      }
    }

    console.log('🚀 Starting SCORM upload process...')
    const packageId = await scormService.uploadPackage(file, lessonId, replace)
    
    console.log('✅ SCORM upload completed successfully:', packageId)
    return NextResponse.json({ 
      success: true, 
      packageId,
      message: 'SCORM package uploaded successfully' 
    })
  } catch (error) {
    console.error('❌ SCORM upload API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload SCORM package'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}