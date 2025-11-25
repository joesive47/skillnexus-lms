'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Award, Download, ExternalLink, Calendar, CheckCircle } from 'lucide-react'

interface UserBadge {
  id: string
  earnedAt: string
  verifyCode: string
  badge: {
    id: string
    title: string
    description: string
    logoUrl?: string
    requirements: Array<{
      course: {
        title: string
      }
      minScore: number
    }>
  }
}

export default function BadgeProfile({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserBadges()
  }, [userId])

  const fetchUserBadges = async () => {
    try {
      const response = await fetch(`/api/badges/user/${userId}`)
      const data = await response.json()
      setBadges(data)
    } catch (error) {
      console.error('Failed to fetch user badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadCertificate = (badge: UserBadge) => {
    const link = document.createElement('a')
    link.href = `/api/badges/certificate/${badge.verifyCode}`
    link.download = `${badge.badge.title}-certificate.pdf`
    link.click()
  }

  const openVerification = (verifyCode: string) => {
    window.open(`/verify/${verifyCode}`, '_blank')
  }

  if (loading) {
    return <div className="animate-pulse">Loading badges...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Badges & Certifications</h2>
        <Badge variant="secondary">{badges.length} earned</Badge>
      </div>

      {badges.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No badges earned yet</h3>
            <p className="text-muted-foreground">
              Complete courses to earn your first badge!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {badges.map((userBadge) => (
            <Card key={userBadge.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {userBadge.badge.logoUrl ? (
                    <img 
                      src={userBadge.badge.logoUrl} 
                      alt={userBadge.badge.title}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold">{userBadge.badge.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(userBadge.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {userBadge.badge.description}
                </p>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium">Completed Requirements:</p>
                  {userBadge.badge.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{req.course.title}</span>
                      <Badge variant="outline" className="ml-auto">
                        {req.minScore}%+
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => downloadCertificate(userBadge)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openVerification(userBadge.verifyCode)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>

                <div className="mt-3 p-2 bg-muted rounded text-xs text-center">
                  Verify Code: {userBadge.verifyCode}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}