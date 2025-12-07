import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins, BookOpen } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return (
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="mb-4">กรุณาเข้าสู่ระบบเพื่อดูหลักสูตร</p>
              <Button asChild>
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Get user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    })
    const userCredits = user?.credits || 0

    // Get courses with enrollment status
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: {
        enrollments: {
          where: { userId: session.user.id }
        },
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-yellow-200/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  หลักสูตรทั้งหมด
                </h1>
                <p className="text-gray-600">
                  ค้นหาและลงทะเบียนเรียนหลักสูตรที่เหมาะกับคุณ
                </p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-full">
                <Coins className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">เครดิต: {userCredits}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">

          {courses.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-yellow-200/50">
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4 text-lg">ยังไม่มีหลักสูตรในขณะนี้</p>
                <Button asChild className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700">
                  <Link href="/dashboard">กลับไปแดชบอร์ด</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isEnrolled = course.enrollments.length > 0
              const canPurchase = userCredits >= course.price
              
              return (
                <Card key={course.id} className="h-full flex flex-col bg-white/80 backdrop-blur-sm shadow-lg border-yellow-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">{course.title}</CardTitle>
                    {course.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    {course.imageUrl && (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-lg mb-4 shadow-md"
                      />
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg">
                        <Coins className="h-5 w-5 text-yellow-600" />
                        <span className="font-bold text-yellow-800">{course.price} เครดิต</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{course._count.lessons} บทเรียน</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    {isEnrolled ? (
                      <div className="w-full space-y-2">
                        <Badge className="w-full justify-center bg-green-100 text-green-800 border-green-300 hover:bg-green-100">
                          ✓ ลงทะเบียนแล้ว
                        </Badge>
                        <Button asChild className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                          <Link href={`/courses/${course.id}`}>เข้าเรียน</Link>
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        disabled={!canPurchase}
                        className={`w-full ${canPurchase ? 'bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700' : ''}`}
                        asChild={canPurchase}
                      >
                        {canPurchase ? (
                          <Link href={`/courses/${course.id}/purchase`}>ซื้อคอร์ส</Link>
                        ) : (
                          <span>เครดิตไม่เพียงพอ</span>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Courses page error:', error)
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">เกิดข้อผิดพลาดในการโหลดหลักสูตร</p>
            <Button asChild>
              <Link href="/dashboard">กลับไปแดชบอร์ด</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}