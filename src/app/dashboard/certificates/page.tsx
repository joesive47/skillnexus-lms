import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Calendar, Eye, Share2, Star, Palette } from "lucide-react"
import Link from "next/link"

export default async function CertificatesPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        select: {
          title: true,
          description: true
        }
      }
    },
    orderBy: { issuedAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 sm:w-20 sm:h-20 sm:mb-6">
            <Award className="w-7 h-7 text-white sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:text-4xl sm:mb-4">
            ใบประกาศนียบัตรของฉัน
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto sm:text-lg">
            ใบประกาศนียบัตรที่คุณได้รับจากการเรียนจบหลักสูตรต่างๆ พร้อมการยืนยันความถูกต้อง
          </p>
          <div className="flex items-center justify-center flex-wrap gap-3 mt-4 sm:gap-4 sm:mt-6">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm sm:text-lg sm:px-6 sm:py-2">
              <Award className="w-3.5 h-3.5 mr-1.5 sm:w-4 sm:h-4 sm:mr-2" />
              {certificates.length} ใบประกาศ
            </Badge>
            <Badge variant="outline" className="px-4 py-1.5 text-sm sm:text-lg sm:px-6 sm:py-2">
              <Star className="w-3.5 h-3.5 mr-1.5 sm:w-4 sm:h-4 sm:mr-2" />
              ยืนยันแล้ว
            </Badge>
          </div>
          <div className="mt-4 sm:mt-6">
            <Link href="/dashboard/certificates/templates">
              <Button variant="outline" size="sm" className="sm:size-lg">
                <Palette className="w-4 h-4 mr-2" />
                ดูเทมเพลตใบประกาศ
              </Button>
            </Link>
          </div>
        </div>

        {certificates.length === 0 ? (
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center sm:p-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center sm:w-32 sm:h-32 sm:mb-8">
                <Award className="w-10 h-10 text-blue-500 sm:w-16 sm:h-16" />
              </div>
              <h3 className="text-xl font-bold mb-3 sm:text-2xl sm:mb-4">ยังไม่มีใบประกาศนียบัตร</h3>
              <p className="text-muted-foreground mb-6 sm:mb-8 sm:text-lg">
                เริ่มต้นการเรียนรู้และรับใบประกาศนียบัตรที่มีคุณค่า
              </p>
              <Link href="/courses">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Award className="w-4 h-4 mr-2" />
                  เลือกหลักสูตร
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                {/* Certificate Preview */}
                <div className="relative h-36 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4 sm:h-48 sm:p-6">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm sm:w-12 sm:h-12">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(certificate.issuedAt).toLocaleDateString('th-TH')}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs opacity-80 mb-0.5">Certificate of Completion</div>
                      <div className="text-sm font-bold leading-tight sm:text-lg">{certificate.course.title}</div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-16 h-16 border border-white/20 rounded-full sm:top-4 sm:right-4 sm:w-20 sm:h-20" />
                  <div className="absolute bottom-3 left-3 w-12 h-12 border border-white/20 rounded-full sm:bottom-4 sm:left-4 sm:w-16 sm:h-16" />
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-base group-hover:text-blue-600 transition-colors sm:text-xl">
                    {certificate.course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  <p className="text-xs text-muted-foreground line-clamp-2 sm:text-sm">
                    {certificate.course.description || 'หลักสูตรการเรียนรู้ออนไลน์ที่ได้รับการรับรองคุณภาพ'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-gray-50 p-2 rounded-lg sm:p-3">
                    <span>เลขที่:</span>
                    <span className="font-mono font-semibold">{certificate.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/api/certificates/${certificate.id}/download`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm" size="sm">
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        ดาวน์โหลด
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="px-2.5 sm:px-3">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="px-2.5 sm:px-3">
                      <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Achievement Stats */}
        {certificates.length > 0 && (
          <div className="mt-10 text-center sm:mt-16">
            <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-8">
                <h3 className="text-lg font-bold mb-5 sm:text-2xl sm:mb-6">สถิติความสำเร็จ</h3>
                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  {[
                    { icon: Award, color: 'from-green-500 to-emerald-500', textColor: 'text-green-600', value: certificates.length, label: 'ใบประกาศนียบัตร' },
                    { icon: Star, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-600', value: certificates.length, label: 'หลักสูตรที่จบ' },
                    { icon: Calendar, color: 'from-purple-500 to-pink-500', textColor: 'text-purple-600', value: certificates.length > 0 ? new Date(certificates[0].issuedAt).getFullYear() : new Date().getFullYear(), label: 'ปีที่เริ่มเรียน' },
                  ].map(({ icon: Icon, color, textColor, value, label }) => (
                    <div key={label} className="text-center">
                      <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-full flex items-center justify-center mx-auto mb-2 sm:w-16 sm:h-16 sm:mb-4`}>
                        <Icon className="w-5 h-5 text-white sm:w-8 sm:h-8" />
                      </div>
                      <div className={`text-xl font-bold ${textColor} sm:text-3xl`}>{value}</div>
                      <div className="text-muted-foreground text-xs sm:text-base">{label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}