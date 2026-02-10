import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Award, Download, Calendar, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function CertificationsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Get all user certifications
  const userCertifications = await prisma.userCertification.findMany({
    where: { userId: session.user.id },
    include: {
      certification: {
        include: {
          badges: {
            include: {
              badge: true
            }
          }
        }
      }
    },
    orderBy: { issuedAt: 'desc' }
  })

  // Get all user badges
  const userBadges = await prisma.userSkillBadge.findMany({
    where: { userId: session.user.id },
    include: {
      badge: true
    },
    orderBy: { earnedAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Certifications & Badges</h1>
        <p className="text-gray-600">Your learning achievements and credentials</p>
      </div>

      {/* Certifications Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Certifications</h2>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {userCertifications.length}
          </span>
        </div>

        {userCertifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">You haven't earned any certifications yet.</p>
              <p className="text-sm text-gray-400 mb-6">
                Complete assessments and earn badges to unlock certifications!
              </p>
              <Link href="/skills-assessment">
                <Button>Start Assessment</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCertifications.map((userCert) => (
              <Card key={userCert.id} className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
                <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-6 -translate-y-6">
                  <div className="w-full h-full rounded-full bg-green-600 opacity-10"></div>
                </div>
                
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{userCert.certification.name}</CardTitle>
                      {userCert.certification.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {userCert.certification.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Issued: {new Date(userCert.issuedAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {userCert.certification.badges.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 mb-2">Required Badges:</p>
                      <div className="flex flex-wrap gap-1">
                        {userCert.certification.badges.map((cb) => (
                          <span
                            key={cb.id}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                          >
                            {cb.badge.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <a
                      href={`/api/certifications/${userCert.id}/download`}
                      download
                    >
                      <Button className="w-full" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Badges Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-6 w-6 text-yellow-600" />
          <h2 className="text-2xl font-bold">Badges</h2>
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {userBadges.length}
          </span>
        </div>

        {userBadges.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">You haven't earned any badges yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Complete quizzes and assessments to earn badges!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {userBadges.map((userBadge) => (
              <Card key={userBadge.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 pb-4">
                  <div className="mb-3">
                    {userBadge.badge.imageUrl ? (
                      <img
                        src={userBadge.badge.imageUrl}
                        alt={userBadge.badge.name}
                        className="w-20 h-20 mx-auto rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <Award className="h-10 w-10 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{userBadge.badge.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {userBadge.badge.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(userBadge.earnedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
