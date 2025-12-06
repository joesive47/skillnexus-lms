import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { DownloadCertificateButton } from '@/components/DownloadCertificateButton'

export default async function BARDCertificatesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  let certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    include: { course: { select: { title: true } } },
    orderBy: { issuedAt: 'desc' }
  })

  // Demo data if no certificates
  if (certificates.length === 0) {
    certificates = [
      {
        id: 'demo-1',
        certificateNumber: 'BARD-2025-TH-DEMO01',
        verificationToken: 'demo-token-1',
        status: 'ACTIVE',
        issuedAt: new Date(),
        course: { title: 'Full Stack Web Development' },
        bardData: JSON.stringify({
          careerReadiness: { fitScore: 90, readinessLevel: 5 }
        })
      },
      {
        id: 'demo-2',
        certificateNumber: 'BARD-2025-TH-DEMO02',
        verificationToken: 'demo-token-2',
        status: 'ACTIVE',
        issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        course: { title: 'React & Next.js Mastery' },
        bardData: JSON.stringify({
          careerReadiness: { fitScore: 85, readinessLevel: 4 }
        })
      },
      {
        id: 'demo-3',
        certificateNumber: 'BARD-2025-TH-DEMO03',
        verificationToken: 'demo-token-3',
        status: 'ACTIVE',
        issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        course: { title: 'Python Data Science' },
        bardData: JSON.stringify({
          careerReadiness: { fitScore: 88, readinessLevel: 4 }
        })
      }
    ] as any
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My BARD Certificates</h1>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No certificates yet. Complete courses to earn BARD certifications.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {certificates.map((cert) => {
            const bardData = JSON.parse(cert.bardData)
            const { careerReadiness } = bardData

            return (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{cert.course.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {cert.certificateNumber}
                      </p>
                    </div>
                    <Badge variant={cert.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {cert.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Career Fit Score</p>
                      <p className="text-2xl font-bold">{careerReadiness.fitScore}/100</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Readiness Level</p>
                      <p className="text-2xl font-bold">{careerReadiness.readinessLevel}/5</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/bard-verify/${cert.verificationToken}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Certificate
                    </Link>
                    <DownloadCertificateButton certificateNumber={cert.certificateNumber} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
