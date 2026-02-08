import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertCircle, Calendar, Shield } from 'lucide-react'

interface CertificateVerifyPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CertificateVerifyPage({ params }: CertificateVerifyPageProps) {
  const { id } = await params

  const certificate = await prisma.certificateFile.findUnique({
    where: { 
      verificationId: id 
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      course: {
        select: {
          title: true
        }
      }
    }
  })

  if (!certificate) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              Certificate Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The certificate verification ID <code className="bg-gray-100 px-2 py-1 rounded">{id}</code> was not found in our system.
            </p>
            <p className="text-muted-foreground mt-4">
              Please verify that you have entered the correct verification ID.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = certificate.expiryDate && new Date(certificate.expiryDate) < new Date()
  const isRevoked = certificate.status === 'REVOKED'
  const isValid = certificate.status === 'ACTIVE' && !isExpired && !isRevoked

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isValid ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <span className="text-green-600">Valid Certificate</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-red-600" />
                <span className="text-red-600">Invalid Certificate</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={isValid ? 'default' : isRevoked ? 'destructive' : 'outline'}>
              {isRevoked ? 'REVOKED' : isExpired ? 'EXPIRED' : certificate.status}
            </Badge>
          </div>

          {/* Certificate Details */}
          <div className="space-y-4 border-t pt-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Recipient</h3>
              <p className="text-lg font-semibold">{certificate.user.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Course</h3>
              <p className="text-lg">{certificate.course.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Issue Date
                </h3>
                <p>{new Date(certificate.issueDate).toLocaleDateString()}</p>
              </div>

              {certificate.expiryDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Expiry Date
                  </h3>
                  <p className={isExpired ? 'text-red-600 font-medium' : ''}>
                    {new Date(certificate.expiryDate).toLocaleDateString()}
                    {isExpired && ' (Expired)'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Verification ID
              </h3>
              <code className="block bg-gray-100 px-3 py-2 rounded font-mono text-sm">
                {certificate.verificationId}
              </code>
            </div>
          </div>

          {/* Revocation Reason */}
          {isRevoked && certificate.revokedReason && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-red-600 mb-1">Revocation Reason</h3>
              <p className="text-sm text-muted-foreground">
                {certificate.revokedReason}
              </p>
            </div>
          )}

          {/* Verification Message */}
          <div className="border-t pt-4">
            {isValid ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ This certificate is valid and was issued by SkillNexus Learning Management System.
                </p>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
