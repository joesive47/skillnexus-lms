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
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">หลักสูตรทั้งหมด</h1>
          <p className="text-muted-foreground mb-4">
            ค้นหาและลงทะเบียนเรียนหลักสูตรที่เหมาะกับคุณ
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span>เครดิตของคุณ: <strong>{userCredits}</strong></span>
          </div>
        </div>

        {courses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">ยังไม่มีหลักสูตรในขณะนี้</p>
              <Button asChild>
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
                <Card key={course.id} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    {course.imageUrl && (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-32 object-cover rounded-md mb-4"
                      />
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{course.price} เครดิต</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{course._count.lessons} บทเรียน</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    {isEnrolled ? (
                      <div className="w-full space-y-2">
                        <Badge variant="secondary" className="w-full justify-center">
                          ลงทะเบียนแล้ว
                        </Badge>
                        <Button asChild className="w-full">
                          <Link href={`/courses/${course.id}`}>เข้าเรียน</Link>
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        disabled={!canPurchase}
                        className="w-full"
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