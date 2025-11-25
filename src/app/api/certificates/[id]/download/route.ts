import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const certificate = await prisma.certificate.findUnique({
      where: { uniqueId: id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true,
            description: true
          }
        }
      }
    })

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    if (certificate.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Certificate - ${certificate.course.title}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .certificate {
                background: white;
                max-width: 800px;
                margin: 0 auto;
                padding: 60px;
                border: 8px solid #f4c430;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
            }
            .header {
                margin-bottom: 40px;
            }
            .logo {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 32px;
                font-weight: bold;
            }
            .title {
                font-size: 36px;
                font-weight: bold;
                color: #2d3748;
                margin-bottom: 10px;
            }
            .subtitle {
                font-size: 18px;
                color: #667eea;
                margin-bottom: 40px;
            }
            .recipient {
                font-size: 48px;
                font-weight: bold;
                color: #2d3748;
                margin: 30px 0;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 20px;
            }
            .course {
                font-size: 28px;
                color: #667eea;
                font-weight: 600;
                margin: 30px 0;
            }
            .details {
                display: flex;
                justify-content: space-between;
                margin: 40px 0;
                padding: 20px 0;
                border-top: 1px solid #e2e8f0;
                border-bottom: 1px solid #e2e8f0;
            }
            .detail-item {
                text-align: center;
            }
            .detail-label {
                font-size: 14px;
                color: #718096;
                margin-bottom: 5px;
            }
            .detail-value {
                font-size: 16px;
                font-weight: 600;
                color: #2d3748;
            }
            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
            }
            .signature {
                text-align: center;
                width: 200px;
            }
            .signature-line {
                border-top: 2px solid #2d3748;
                margin-bottom: 10px;
            }
            .signature-title {
                font-weight: 600;
                color: #2d3748;
            }
            .signature-subtitle {
                font-size: 12px;
                color: #718096;
            }
            .verification {
                margin-top: 40px;
                padding: 20px;
                background: #f7fafc;
                border-radius: 10px;
                font-size: 12px;
                color: #718096;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="header">
                <div class="logo">SN</div>
                <div class="title">Certificate of Completion</div>
                <div class="subtitle">SkillNexus Learning Management System</div>
            </div>
            
            <div style="margin: 40px 0;">
                <div style="font-size: 18px; color: #718096; margin-bottom: 20px;">
                    This is to certify that
                </div>
                <div class="recipient">${certificate.user.name}</div>
                <div style="font-size: 18px; color: #718096; margin-bottom: 20px;">
                    has successfully completed the course
                </div>
                <div class="course">${certificate.course.title}</div>
            </div>

            <div class="details">
                <div class="detail-item">
                    <div class="detail-label">Issue Date</div>
                    <div class="detail-value">${new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Certificate ID</div>
                    <div class="detail-value" style="font-family: monospace; font-size: 12px;">${certificate.uniqueId}</div>
                </div>
            </div>

            <div class="signatures">
                <div class="signature">
                    <div class="signature-line"></div>
                    <div class="signature-title">SkillNexus</div>
                    <div class="signature-subtitle">Learning Platform</div>
                </div>
                <div class="signature">
                    <div class="signature-line"></div>
                    <div class="signature-title">Authorized Signature</div>
                    <div class="signature-subtitle">Certificate Authority</div>
                </div>
            </div>

            <div class="verification">
                <strong>Certificate Verification:</strong><br>
                This certificate can be verified at: ${process.env.NEXTAUTH_URL}/verify<br>
                Certificate ID: ${certificate.uniqueId}<br>
                Issued by: SkillNexus Learning Management System
            </div>
        </div>
    </body>
    </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="certificate-${certificate.course.title.replace(/[^a-zA-Z0-9]/g, '-')}.html"`
      }
    })

  } catch (error) {
    console.error('Error downloading certificate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}