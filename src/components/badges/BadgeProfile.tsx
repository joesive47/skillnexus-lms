'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Award, Download, ExternalLink, Calendar, CheckCircle, Trophy, Star } from 'lucide-react'

interface LegacyBadge {
  id: string
  earnedAt: string
  badge: {
    name: string
    description?: string
    icon?: string
  }
}

interface SkillBadge {
  id: string
  issuedDate: string
  verificationCode: string
  badge: {
    badgeName: string
    skillCategory: string
    level: string
    description?: string
    imageUrl?: string
  }
}

interface Certification {
  id: string
  issueDate: string
  certificationNumber: string
  verificationCode: string
  certification: {
    certificationName: string
    category: string
    description: string
  }
}

interface CertificationProgress {
  certificationId: string
  certificationName: string
  progress: number
  totalBadges: number
  earnedBadges: number
  missingBadges: any[]
}

export default function BadgeProfile({ userId }: { userId: string }) {
  const [legacyBadges, setLegacyBadges] = useState<LegacyBadge[]>([])
  const [skillBadges, setSkillBadges] = useState<SkillBadge[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [certProgress, setCertProgress] = useState<CertificationProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBadgeData()
  }, [userId])

  const fetchBadgeData = async () => {
    try {
      const [legacyRes, skillRes, certRes] = await Promise.all([
        fetch(`/api/badges/legacy/${userId}`),
        fetch(`/api/badges/skill/${userId}`),
        fetch(`/api/certifications/${userId}`)
      ])

      if (legacyRes.ok) setLegacyBadges(await legacyRes.json())
      if (skillRes.ok) setSkillBadges(await skillRes.json())
      if (certRes.ok) setCertifications(await certRes.json())
    } catch (error) {
      console.error('Failed to fetch badge data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-500'
      case 'INTERMEDIATE': return 'bg-blue-500'
      case 'ADVANCED': return 'bg-purple-500'
      case 'PROFESSIONAL': return 'bg-gold-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading badges...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Credentials</h2>
        <div className="flex gap-2">
          <Badge variant="secondary">{skillBadges.length} Skill Badges</Badge>
          <Badge variant="secondary">{certifications.length} Certifications</Badge>
        </div>
      </div>

      {/* Certifications */}
      {certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Earned Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">{cert.certification.certificationName}</h3>
                      <p className="text-sm text-muted-foreground">{cert.certification.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{cert.certification.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-center text-muted-foreground">
                    Cert: {cert.certificationNumber}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Badges */}
      {skillBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              Skill Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {skillBadges.map((badge) => (
                <div key={badge.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {badge.badge.imageUrl ? (
                      <img 
                        src={badge.badge.imageUrl} 
                        alt={badge.badge.badgeName}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className={`h-10 w-10 ${getLevelColor(badge.badge.level)} rounded-full flex items-center justify-center`}>
                        <Award className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{badge.badge.badgeName}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {badge.badge.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {badge.badge.skillCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(badge.issuedDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legacy Badges */}
      {legacyBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-gray-500" />
              Legacy Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
              {legacyBadges.map((badge) => (
                <div key={badge.id} className="p-3 border rounded-lg text-center">
                  <div className="h-8 w-8 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-medium text-sm">{badge.badge.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {skillBadges.length === 0 && certifications.length === 0 && legacyBadges.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No credentials earned yet</h3>
            <p className="text-muted-foreground">
              Complete courses and assessments to earn your first badge!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}