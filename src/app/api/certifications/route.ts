import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user's certificates from the Certificate model
    const certificates = await prisma.certificate.findMany({
      where: { 
        userId,
        status: 'ACTIVE'
      },
      include: {
        course: { 
          select: { 
            title: true, 
            imageUrl: true 
          } 
        },
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    })

    // Transform to match the interface expected by the frontend
    const courseCertificates = certificates.map(cert => ({
      id: cert.id,
      verificationCode: cert.certificateNumber, // Using certificateNumber as verificationCode
      issueDate: cert.issuedAt.toISOString(),
      expiryDate: cert.expiresAt?.toISOString() || null,
      status: cert.status,
      course: {
        title: cert.course.title,
        imageUrl: cert.course.imageUrl || ''
      },
      definition: {
        issuerName: 'SkillNexus Academy'
      }
    }))

    return NextResponse.json({
      courseCertificates,
      courseBadges: [],
      careerCertificates: [],
      careerBadges: []
    })

  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
