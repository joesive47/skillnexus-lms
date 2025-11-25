import { BadgeService } from '@/lib/badge-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Calendar, CheckCircle, User, ExternalLink } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function VerifyBadgePage({ 
  params 
}: { 
  params: { verifyCode: string } 
}) {
  const badgeService = new BadgeService()
  const userBadge = await badgeService.getBadgeByVerifyCode(params.verifyCode)

  if (!userBadge) {
    notFound()
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/verify/${params.verifyCode}`)}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Badge Verification
            </h1>
            <p className="text-gray-600">
              This certificate has been verified and is authentic
            </p>
          </div>

          {/* Main Certificate Card */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center gap-4">
                {userBadge.badge.icon ? (
                  <img 
                    src={userBadge.badge.icon} 
                    alt={userBadge.badge.name}
                    className="h-16 w-16 rounded-full bg-white p-2"
                  />
                ) : (
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{userBadge.badge.name}</h2>
                  <p className="text-blue-100">SkillNexus LMS Certification</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Certificate Holder</h3>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-lg">{userBadge.user?.name || userBadge.user?.email || 'Unknown User'}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Issue Date</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(userBadge.earnedAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{userBadge.badge.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Badge Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Points Earned: {userBadge.badge.points}</span>
                      </div>
                      {userBadge.badge.criteria && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Criteria: {userBadge.badge.criteria}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">QR Code Verification</h3>
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="mx-auto border rounded-lg"
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Verification Code</p>
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                      {params.verifyCode}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              This certificate was issued by SkillNexus LMS and can be verified at any time.
            </p>
            <div className="flex items-center justify-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Verification URL: {process.env.NEXTAUTH_URL}/verify/{params.verifyCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}