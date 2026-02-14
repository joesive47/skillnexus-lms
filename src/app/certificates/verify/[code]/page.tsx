import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertCircle, Calendar, Shield, Award, User } from 'lucide-react'
import Link from 'next/link'

interface VerifyPageProps {
  params: Promise<{
    code: string
  }>
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { code } = await params

  // Try CourseCertificate first
  let certificate = await prisma.courseCertificate.findUnique({
    where: { verificationCode: code },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  })

  // Fallback to CertificateFile
  let certificateFile = null
  if (!certificate) {
    certificateFile = await prisma.certificateFile.findUnique({
      where: { verificationId: code },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    })
  }

  // Not found
  if (!certificate && !certificateFile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-red-200 shadow-lg">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-6 w-6" />
                Certificate Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-2">
                The verification code <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">{code}</code> was not found.
              </p>
              <Link href="/certificates" className="text-blue-600 hover:text-blue-800 underline">← Back to Certificates</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render CourseCertificate
  if (certificate) {
    const isExpired = certificate.expiryDate && new Date(certificate.expiryDate) < new Date()
    const isValid = !isExpired

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto shadow-xl">
            <CardHeader className={isValid ? 'bg-green-50' : 'bg-red-50'}>
              <CardTitle className="flex items-center gap-3">
                {isValid ? (
                  <><CheckCircle2 className="h-8 w-8 text-green-600" /><span className="text-2xl text-green-700">✓ Valid Certificate</span></>
                ) : (
                  <><XCircle className="h-8 w-8 text-red-600" /><span className="text-2xl text-red-700">✗ Expired Certificate</span></>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="text-center pb-4 border-b">
                <Award className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Certificate of Completion</h2>
                <p className="text-gray-500">SkillNexus Learning Management System</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Awarded To</h3>
                </div>
                <p className="text-2xl font-bold text-gray-800">{certificate.user.name}</p>
                <p className="text-sm text-gray-600 mt-1">{certificate.user.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Course Completed</h3>
                <p className="text-xl font-semibold text-gray-800">{certificate.course.title}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <h3 className="text-sm font-medium text-gray-600">Issue Date</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {certificate.expiryDate && (
                  <div className={`rounded-lg p-4 ${isExpired ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`h-4 w-4 ${isExpired ? 'text-red-600' : 'text-gray-600'}`} />
                      <h3 className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>Expiry Date</h3>
                    </div>
                    <p className={`text-lg font-semibold ${isExpired ? 'text-red-700' : 'text-gray-800'}`}>
                      {new Date(certificate.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {isExpired && <span className="ml-2 text-sm">(Expired)</span>}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Verification Code</h3>
                </div>
                <code className="block bg-gray-100 px-4 py-3 rounded-md font-mono text-sm text-gray-800 break-all">{certificate.verificationCode}</code>
              </div>

              {isValid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Verified & Valid</p>
                      <p className="text-sm text-green-700 mt-1">This certificate is authentic and was issued by SkillNexus.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Certificate Expired</p>
                      <p className="text-sm text-red-700 mt-1">This certificate has expired and is no longer valid.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-6 text-center">
                <Link href="/certificates" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">← View All Certificates</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render CertificateFile
  if (certificateFile) {
    const isExpired = certificateFile.expiryDate && new Date(certificateFile.expiryDate) < new Date()
    const isRevoked = certificateFile.status === 'REVOKED'
    const isValid = certificateFile.status === 'ACTIVE' && !isExpired && !isRevoked

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader className={isValid ? 'bg-green-50' : 'bg-red-50'}>
              <CardTitle className="flex items-center gap-2">
                {isValid ? (
                  <><CheckCircle2 className="h-6 w-6 text-green-600" /><span className="text-green-700">Valid Certificate</span></>
                ) : (
                  <><AlertCircle className="h-6 w-6 text-red-600" /><span className="text-red-700">Invalid Certificate</span></>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={isValid ? 'default' : isRevoked ? 'destructive' : 'outline'}>
                  {isRevoked ? 'REVOKED' : isExpired ? 'EXPIRED' : certificateFile.status}
                </Badge>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Recipient</h3>
                  <p className="text-lg font-semibold">{certificateFile.user.name}</p>
                  <p className="text-sm text-gray-600">{certificateFile.user.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Course</h3>
                  <p className="text-lg">{certificateFile.course.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />Issue Date
                    </h3>
                    <p>{new Date(certificateFile.issueDate).toLocaleDateString()}</p>
                  </div>

                  {certificateFile.expiryDate && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />Expiry Date
                      </h3>
                      <p className={isExpired ? 'text-red-600 font-medium' : ''}>
                        {new Date(certificateFile.expiryDate).toLocaleDateString()}
                        {isExpired && ' (Expired)'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Shield className="h-4 w-4" />Verification ID
                  </h3>
                  <code className="block bg-gray-100 px-3 py-2 rounded font-mono text-sm break-all">{certificateFile.verificationId}</code>
                </div>
              </div>

              {isRevoked && certificateFile.revokedReason && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-red-600 mb-1">Revocation Reason</h3>
                  <p className="text-sm text-muted-foreground">{certificateFile.revokedReason}</p>
                </div>
              )}

              {isValid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">✓ This certificate is valid and was issued by SkillNexus.</p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    ✗ This certificate is no longer valid.
                    {isRevoked && ' It has been revoked.'}
                    {isExpired && !isRevoked && ' It has expired.'}
                  </p>
                </div>
              )}

              <div className="border-t pt-4 text-center">
                <Link href="/certificates" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">← View All Certificates</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
