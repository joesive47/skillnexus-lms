import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { UserRole } from '@/lib/types'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { DownloadCertificateButton } from '@/components/DownloadCertificateButton'

export default async function AdminBARDCertificatesPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard')
  }

  const certificates = await prisma.certificate.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { issuedAt: 'desc' },
    take: 50
  })

  const stats = {
    total: certificates.length,
    active: certificates.filter(c => c.status === 'ACTIVE').length,
    revoked: certificates.filter(c => c.status === 'REVOKED').length,
    expired: certificates.filter(c => c.expiresAt && new Date(c.expiresAt) < new Date()).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">BARD Certificates Management</h1>
          <p className="text-muted-foreground mt-1">
            จัดการใบรับรอง BARD (Behavioral, Aptitude, Role-specific, Development)
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/bard-certificates/test">
              ทดสอบระบบ
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/admin/bard-certificates/generate">
              <Award className="w-4 h-4 mr-2" />
              สร้างใบรับรอง
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ทั้งหมด</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Award className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ใช้งานอยู่</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ถูกเพิกถอน</p>
                <p className="text-2xl font-bold text-red-600">{stats.revoked}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">หมดอายุ</p>
                <p className="text-2xl font-bold text-orange-600">{stats.expired}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการใบรับรอง BARD</CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              ยังไม่มีใบรับรอง BARD ในระบบ
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">เลขที่ใบรับรอง</th>
                    <th className="text-left p-3">ผู้ใช้</th>
                    <th className="text-left p-3">คอร์ส</th>
                    <th className="text-left p-3">วันที่ออก</th>
                    <th className="text-left p-3">สถานะ</th>
                    <th className="text-left p-3">BARD Score</th>
                    <th className="text-right p-3">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => {
                    const bardData = JSON.parse(cert.bardData)
                    const fitScore = bardData.careerReadiness?.fitScore || 0

                    return (
                      <tr key={cert.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {cert.certificateNumber}
                          </code>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{cert.user.name}</p>
                            <p className="text-xs text-muted-foreground">{cert.user.email}</p>
                          </div>
                        </td>
                        <td className="p-3">{cert.course.title}</td>
                        <td className="p-3">
                          {new Date(cert.issuedAt).toLocaleDateString('th-TH')}
                        </td>
                        <td className="p-3">
                          <Badge variant={cert.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {cert.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${fitScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{fitScore}/100</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/bard-verify/${cert.verificationToken}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <DownloadCertificateButton certificateNumber={cert.certificateNumber} size="sm" />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
