'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Award, Shield, Download, ExternalLink, Lock, CheckCircle, Clock, Trophy } from 'lucide-react'
import Link from 'next/link'

interface CourseCertificate {
  id: string
  verificationCode: string
  issueDate: string
  expiryDate: string | null
  status: string
  course: { title: string; imageUrl: string }
  definition: { issuerName: string }
}

interface CourseBadge {
  id: string
  issueDate: string
  course: { title: string }
  definition: { name: string; asset: { url: string } | null }
}

interface CareerCertificate {
  id: string
  verificationCode: string
  issueDate: string
  expiryDate: string | null
  status: string
  courseBadgesSnapshot: string
  careerPath: { name: string; category: string }
  definition: { issuerName: string }
}

interface CareerBadge {
  id: string
  issueDate: string
  careerPath: { name: string }
  definition: { name: string; asset: { url: string } | null }
}

interface CareerPathProgress {
  id: string
  name: string
  category: string
  description: string
  totalCourses: number
  completedCourses: number
  requiredCourses: string[]
  userCompletedCourses: string[]
  certificateEarned: boolean
  badgeEarned: boolean
}

export default function LearnerCertificationsPage() {
  const [courseCertificates, setCourseCertificates] = useState<CourseCertificate[]>([])
  const [courseBadges, setCourseBadges] = useState<CourseBadge[]>([])
  const [careerCertificates, setCareerCertificates] = useState<CareerCertificate[]>([])
  const [careerBadges, setCareerBadges] = useState<CareerBadge[]>([])
  const [careerProgress, setCareerProgress] = useState<CareerPathProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [certsRes, progressRes] = await Promise.all([
        fetch('/api/certifications'),
        fetch('/api/career-progress')
      ])

      const certData = await certsRes.json()
      setCourseCertificates(certData.courseCertificates || [])
      setCourseBadges(certData.courseBadges || [])
      setCareerCertificates(certData.careerCertificates || [])
      setCareerBadges(certData.careerBadges || [])

      const progressData = await progressRes.json()
      setCareerProgress(progressData.careerPaths || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Certifications & Badges</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            {courseCertificates.length} Certificates
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            {courseBadges.length} Badges
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="certificates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certificates">Course Certificates</TabsTrigger>
          <TabsTrigger value="badges">Course Badges</TabsTrigger>
          <TabsTrigger value="career-paths">Career Paths</TabsTrigger>
          <TabsTrigger value="career-achievements">Career Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates">
          <CourseCertificatesGrid certificates={courseCertificates} />
        </TabsContent>

        <TabsContent value="badges">
          <CourseBadgesGrid badges={courseBadges} />
        </TabsContent>

        <TabsContent value="career-paths">
          <CareerPathsProgress progress={careerProgress} />
        </TabsContent>

        <TabsContent value="career-achievements">
          <CareerAchievements 
            certificates={careerCertificates}
            badges={careerBadges}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CourseCertificatesGrid({ certificates }: { certificates: CourseCertificate[] }) {
  if (certificates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Award className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
          <p className="text-muted-foreground text-center">
            Complete courses to earn your first certificate!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map(cert => (
        <CertificateCard key={cert.id} certificate={cert} />
      ))}
    </div>
  )
}

function CertificateCard({ certificate }: { certificate: CourseCertificate }) {
  const isExpired = certificate.expiryDate && new Date(certificate.expiryDate) < new Date()
  
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 transform rotate-45 translate-x-8 -translate-y-8">
        <Award className="w-6 h-6 text-white absolute bottom-2 left-2 transform -rotate-45" />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{certificate.course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Issued by {certificate.definition.issuerName}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={isExpired ? "destructive" : "default"}>
            {isExpired ? "Expired" : certificate.status}
          </Badge>
          {certificate.expiryDate && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isExpired ? "Expired" : "Valid"}
            </Badge>
          )}
        </div>
        
        <div className="text-sm space-y-1">
          <p><strong>Issued:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
          {certificate.expiryDate && (
            <p><strong>Expires:</strong> {new Date(certificate.expiryDate).toLocaleDateString()}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <CertificateViewDialog certificate={certificate} />
          <Button size="sm" variant="outline" asChild>
            <Link href={`/verify/${certificate.verificationCode}`} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Verify
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CertificateViewDialog({ certificate }: { certificate: CourseCertificate }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Award className="w-4 h-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Certificate - {certificate.course.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg text-center">
            <div className="mb-6">
              <Award className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Certificate of Completion</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">This certifies that</p>
              <p className="text-2xl font-bold text-blue-600">Student Name</p>
              <p className="text-lg">has successfully completed</p>
              <p className="text-xl font-semibold">{certificate.course.title}</p>
              <p className="text-sm">Issued by {certificate.definition.issuerName}</p>
              <p className="text-sm">Date: {new Date(certificate.issueDate).toLocaleDateString()}</p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-500">
                Verification Code: {certificate.verificationCode}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href={`/api/certificates/download/${certificate.verificationCode}`} target="_blank">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CourseBadgesGrid({ badges }: { badges: CourseBadge[] }) {
  if (badges.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
          <p className="text-muted-foreground text-center">
            Earn certificates to unlock badges!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {badges.map(badge => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  )
}

function BadgeCard({ badge }: { badge: CourseBadge }) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="mb-3">
          {badge.definition.asset?.url ? (
            <img 
              src={badge.definition.asset.url} 
              alt={badge.definition.name}
              className="w-16 h-16 mx-auto rounded-full"
            />
          ) : (
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        <h3 className="font-semibold text-sm mb-1">{badge.definition.name}</h3>
        <p className="text-xs text-muted-foreground mb-2">{badge.course.title}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(badge.issueDate).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}

function CareerPathsProgress({ progress }: { progress: CareerPathProgress[] }) {
  return (
    <div className="space-y-6">
      {progress.map(path => (
        <Card key={path.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{path.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{path.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {path.certificateEarned ? (
                  <Badge className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Certified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    In Progress
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{path.completedCourses}/{path.totalCourses} courses</span>
              </div>
              <Progress value={(path.completedCourses / path.totalCourses) * 100} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Completed Courses
                </h4>
                <div className="space-y-1">
                  {path.userCompletedCourses.map(courseId => (
                    <Badge key={courseId} variant="outline" className="mr-1 mb-1">
                      Course {courseId.slice(-4)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Remaining Courses
                </h4>
                <div className="space-y-1">
                  {path.requiredCourses
                    .filter(courseId => !path.userCompletedCourses.includes(courseId))
                    .map(courseId => (
                      <Badge key={courseId} variant="secondary" className="mr-1 mb-1">
                        Course {courseId.slice(-4)}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
            
            {path.certificateEarned && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Career Certificate Earned!</h4>
                    <p className="text-sm text-yellow-700">
                      You've completed all requirements for the {path.name} certification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CareerAchievements({ 
  certificates, 
  badges 
}: { 
  certificates: CareerCertificate[]
  badges: CareerBadge[] 
}) {
  if (certificates.length === 0 && badges.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Career Achievements Yet</h3>
          <p className="text-muted-foreground text-center">
            Complete career paths to earn career certificates and badges!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {certificates.map(cert => (
        <CareerCertificateCard key={cert.id} certificate={cert} />
      ))}
    </div>
  )
}

function CareerCertificateCard({ certificate }: { certificate: CareerCertificate }) {
  const courseBadgeIds = JSON.parse(certificate.courseBadgesSnapshot)
  
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 transform rotate-45 translate-x-10 -translate-y-10">
        <Trophy className="w-8 h-8 text-white absolute bottom-2 left-2 transform -rotate-45" />
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          {certificate.careerPath.name} Certification
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {certificate.careerPath.category} • Issued by {certificate.definition.issuerName}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Course Badges Mosaic</h4>
          <div className="grid grid-cols-4 gap-2">
            {courseBadgeIds.slice(0, 8).map((badgeId: string, index: number) => (
              <div key={badgeId} className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            ))}
            {courseBadgeIds.length > 8 && (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">
                +{courseBadgeIds.length - 8}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p><strong>Issued:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
            {certificate.expiryDate && (
              <p><strong>Expires:</strong> {new Date(certificate.expiryDate).toLocaleDateString()}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button size="sm">
              <Award className="w-4 h-4 mr-2" />
              View Certificate
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/verify/${certificate.verificationCode}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Verify
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}