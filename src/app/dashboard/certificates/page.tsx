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
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ใบประกาศนียบัตรของฉัน
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ใบประกาศนียบัตรที่คุณได้รับจากการเรียนจบหลักสูตรต่างๆ พร้อมการยืนยันความถูกต้อง
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="text-lg px-6 py-2">
              <Award className="w-4 h-4 mr-2" />
              {certificates.length} ใบประกาศ
            </Badge>
            <Badge variant="outline" className="text-lg px-6 py-2">
              <Star className="w-4 h-4 mr-2" />
              ยืนยันแล้ว
            </Badge>
          </div>
          <div className="mt-6">
            <Link href="/dashboard/certificates/templates">
              <Button variant="outline" size="lg">
                <Palette className="w-5 h-5 mr-2" />
                ดูเทมเพลตใบประกาศ
              </Button>
            </Link>
          </div>
        </div>

        {certificates.length === 0 ? (
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">ยังไม่มีใบประกาศนียบัตร</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                เริ่มต้นการเรียนรู้และรับใบประกาศนียบัตรที่มีคุณค่า
              </p>
              <Link href="/courses">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Award className="w-5 h-5 mr-2" />
                  เลือกหลักสูตร
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate, index) => (
              <Card key={certificate.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                {/* Certificate Preview */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Award className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(certificate.issuedAt).toLocaleDateString('th-TH')}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs opacity-80 mb-1">Certificate of Completion</div>
                      <div className="text-lg font-bold leading-tight">{certificate.course.title}</div>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded-full"></div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {certificate.course.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {certificate.course.description || 'หลักสูตรการเรียนรู้ออนไลน์ที่ได้รับการรับรองคุณภาพ'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
                    <span>เลขที่ใบประกาศ:</span>
                    <span className="font-mono font-semibold">{certificate.id.slice(-8).toUpperCase()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/api/certificates/${certificate.id}/download`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        ดาวน์โหลด
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="px-3">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Achievement Stats */}
        {certificates.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">สถิติความสำเร็จ</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-green-600">{certificates.length}</div>
                    <div className="text-muted-foreground">ใบประกาศนียบัตร</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{certificates.length}</div>
                    <div className="text-muted-foreground">หลักสูตรที่จบ</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      {certificates.length > 0 ? new Date(certificates[0].issuedAt).getFullYear() : new Date().getFullYear()}
                    </div>
                    <div className="text-muted-foreground">ปีที่เริ่มเรียน</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}