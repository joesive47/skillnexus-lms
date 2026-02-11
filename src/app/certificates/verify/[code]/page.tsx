import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Award, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface VerifyPageProps {
  params: Promise<{
    code: string
  }>
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { code } = await params

  // Find certificate by verification code
  const certificate = await prisma.courseCertificate.findUnique({
    where: { verificationCode: code },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
title: true,
        },
      },
      definition: true,
    },
  })

  const isValid = certificate && certificate.status === 'ACTIVE'
  const isExpired = certificate?.expiryDate && new Date(certificate.expiryDate) < new Date()

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🔍 ตรวจสอบใบรับรอง</h1>
        <p className="text-gray-600">
          Certificate Verification
        </p>
      </div>

      {certificate ? (
        <Card className={isValid && !isExpired ? 'border-green-500' : 'border-red-500'}>
          <CardHeader className={isValid && !isExpired ? 'bg-green-50' : 'bg-red-50'}>
            <div className="flex items-center gap-3">
              {isValid && !isExpired ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <CardTitle className={isValid && !isExpired ? 'text-green-900' : 'text-red-900'}>
                  {isValid && !isExpired ? '✅ ใบรับรองถูกต้อง' : '❌ ใบรับรองไม่ถูกต้อง'}
                </CardTitle>
                <p className={`text-sm ${isValid && !isExpired ? 'text-green-700' : 'text-red-700'}`}>
                  {isValid && !isExpired 
                    ? 'Certificate is valid and active' 
                    : isExpired 
                    ? 'Certificate has expired' 
                    : 'Certificate is not active'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Verification Code */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Verification Code</p>
              <p className="text-lg font-mono font-bold text-gray-900">
                {certificate.verificationCode}
              </p>
            </div>

            {/* Certificate Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Course</p>
                  <p className="font-medium text-gray-900">{certificate.course.title}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Recipient</p>
                  <p className="font-medium text-gray-900">{certificate.user.name}</p>
                  <p className="text-sm text-gray-500">{certificate.user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(certificate.issueDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {certificate.expiryDate && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(certificate.expiryDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {isExpired && (
                      <Badge variant="destructive" className="mt-1">
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Issued By</p>
                  <p className="font-medium text-gray-900">{certificate.definition.issuerName}</p>
                  <p className="text-sm text-gray-500">{certificate.definition.issuerTitle}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={certificate.status === 'ACTIVE' ? 'default' : 'destructive'}>
                    {certificate.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Revocation Info */}
            {certificate.revokedAt && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-900 mb-1">
                  ⚠️ Certificate Revoked
                </p>
                <p className="text-sm text-red-700">
                  <strong>Date:</strong> {new Date(certificate.revokedAt).toLocaleDateString('th-TH')}
                </p>
                {certificate.revokedReason && (
                  <p className="text-sm text-red-700 mt-1">
                    <strong>Reason:</strong> {certificate.revokedReason}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link
                href={`/certificates/${certificate.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium"
              >
                View Certificate
              </Link>
              <Link
                href="/"
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-2 px-4 rounded-lg font-medium"
              >
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-red-500">
          <CardHeader className="bg-red-50">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <CardTitle className="text-red-900">❌ ไม่พบใบรับรอง</CardTitle>
                <p className="text-sm text-red-700">Certificate not found</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              ไม่พบใบรับรองที่มีรหัสยืนยัน: <code className="bg-gray-100 px-2 py-1 rounded">{code}</code>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              กรุณาตรวจสอบรหัสยืนยันให้ถูกต้อง หรือติดต่อผู้ออกใบรับรอง
            </p>
            <Link
              href="/"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg font-medium"
            >
              Back to Home
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            💡 <strong>How to verify:</strong> ใบรับรองที่ถูกต้องจะแสดงสถานะ "Active" 
            และมีข้อมูลครบถ้วน รวมถึงชื่อผู้รับ, คอร์ส, วันที่ออก และผู้ออกใบรับรอง
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
