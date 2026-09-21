import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Calendar, FileText, Download, ShieldCheck, Library } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { verifyCertificateSignature } from '@/lib/certificate-signature'
import QRCode from 'qrcode'

interface CertificatePageProps {
  params: Promise<{
    certificateId: string
  }>
}

async function getCertificate(certificateId: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: certificateId },
    include: {
      user: {
        select: {
          name: true
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

  return certificate
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { certificateId } = await params
  const [certificate, session] = await Promise.all([getCertificate(certificateId), auth()])

  if (!certificate) {
    notFound()
  }
  const isExpired = certificate.expiresAt && certificate.expiresAt < new Date()
  const isValid = certificate.status === 'ACTIVE' && !isExpired && verifyCertificateSignature(certificate)
  const issuedAt = new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Bangkok',
  }).format(certificate.issuedAt)
  const verifyUrl = `/certificates/verify/${certificate.verificationToken}`
  const baseUrl = (process.env.NEXT_PUBLIC_URL || process.env.AUTH_URL || 'https://www.uppowerskill.com').replace(/\/$/, '')
  const qrCodeUrl = await QRCode.toDataURL(`${baseUrl}${verifyUrl}`)
  const hasStudentLibrary = session?.user?.role === 'STUDENT'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Certificate Card */}
          <Card className="border-2 border-yellow-200 shadow-2xl bg-white">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/20 rounded-full">
                  <Award className="w-12 h-12" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold mb-2">
                Certificate of Completion
              </CardTitle>
              <p className="text-blue-100">
                upPowerSkill Learning Platform
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div>
                  <p className="text-lg text-muted-foreground mb-2">
                    This is to certify that
                  </p>
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    {certificate.user.name}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-2">
                    has successfully completed the course
                  </p>
                  <h3 className="text-2xl font-semibold text-blue-600 mb-6">
                    {certificate.course.title}
                  </h3>
                </div>

                <div className="flex justify-center items-center gap-8 py-6 border-t border-b border-gray-200">
                  <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">
                      {issuedAt} น. (ICT)
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm text-muted-foreground">Certificate ID</p>
                    <p className="font-mono text-sm font-medium">
                      {certificate.certificateNumber}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Badge variant={isValid ? 'secondary' : 'destructive'} className="text-lg px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    {isValid ? 'Verified Certificate' : 'Verification Required'}
                  </Badge>
                  
                  <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                    This certificate verifies that the recipient has successfully completed 
                    all course requirements and assessments. This achievement demonstrates 
                    proficiency in the subject matter and commitment to continuous learning.
                  </p>
                </div>

                <div className="mx-auto w-fit rounded-lg border bg-white p-3 text-center">
                  <img src={qrCodeUrl} alt="QR code for certificate verification" className="mx-auto h-32 w-32" />
                  <Link href={verifyUrl} className="mt-2 block text-xs text-blue-700 hover:underline">สแกน QR หรือกดเพื่อตรวจสอบ</Link>
                </div>

                {/* Signature Section */}
                <div className="pt-8 border-t border-gray-200">
                  <div className="flex justify-between items-end max-w-md mx-auto">
                    <div className="text-center">
                      <div className="w-32 h-px bg-gray-400 mb-2"></div>
                      <p className="text-sm font-medium">upPowerSkill</p>
                      <p className="text-xs text-muted-foreground">Learning Platform</p>
                    </div>
                    <div className="text-center">
                      <img
                        src="/branding/uppowerskill-authorized-seal-320.png"
                        alt="upPowerSkill authorized seal"
                        className="mx-auto mb-1 h-16 w-16 object-contain"
                      />
                      <p className="text-sm font-medium">Authorized by upPowerSkill</p>
                      <p className="text-xs text-muted-foreground">Digital Certificate Authority</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" asChild>
              <a href={`/api/certificates/download/${certificate.certificateNumber}`} download>
                <Download className="w-4 h-4 mr-2" />
                ดาวน์โหลด PDF
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href={verifyUrl}>
                <ShieldCheck className="w-4 h-4 mr-2" />
                ตรวจสอบความถูกต้อง
              </Link>
            </Button>
            <Button asChild>
              <Link href={hasStudentLibrary ? '/dashboard/certificates' : '/courses'}>
                <Library className="w-4 h-4 mr-2" />
                {hasStudentLibrary ? 'คลังใบประกาศของฉัน' : 'ดูหลักสูตร'}
              </Link>
            </Button>
          </div>

          {/* Verification Info */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Certificate Verification</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This certificate can be verified using the certificate ID above. 
                  Visit our verification portal or contact us for authentication.
                </p>
                <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                  <span>Issued by: upPowerSkill LMS</span>
                  <span>•</span>
                  <span>Verification ID: {certificate.verificationToken}</span>
                  <span>•</span>
                  <span>Digitally signed &amp; database verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
