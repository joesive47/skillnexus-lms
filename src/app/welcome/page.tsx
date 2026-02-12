"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Award, Users, TrendingUp } from 'lucide-react'

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userName = session.user?.name || 'ผู้ใช้'
  const userRole = session.user?.role || 'USER'

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ยินดีต้อนรับ! 🎉
          </h1>
          <p className="text-2xl text-gray-700 mb-2">{userName}</p>
          <p className="text-gray-600">
            {userRole === 'ADMIN' && 'ผู้ดูแลระบบ'}
            {userRole === 'INSTRUCTOR' && 'ครูผู้สอน'}
            {userRole === 'TEACHER' && 'ครูผู้สอน'}
            {userRole === 'USER' && 'ผู้เรียน'}
            {userRole === 'STUDENT' && 'ผู้เรียน'}
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
            <Link href="/courses">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>หลักสูตร</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">เรียกดูและลงทะเบียนหลักสูตร</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
            <Link href="/dashboard">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>แดชบอร์ด</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">ดูความคืบหน้าการเรียนของคุณ</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
            <Link href="/certificates">
              <CardHeader>
                <Award className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>ใบประกาศนียบัตร</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">ดูใบประกาศนียบัตรของคุณ</p>
              </CardContent>
            </Link>
          </Card>

          {(userRole === 'ADMIN' || userRole === 'INSTRUCTOR' || userRole === 'TEACHER') && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
              <Link href="/admin/dashboard">
                <CardHeader>
                  <Users className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>จัดการระบบ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">จัดการผู้ใช้และหลักสูตร</p>
                </CardContent>
              </Link>
            </Card>
          )}
        </div>

        {/* Main Action Button */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white shadow-lg">
            <Link href="/courses">
              <BookOpen className="mr-2 h-5 w-5" />
              เริ่มเรียนเลย
            </Link>
          </Button>
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">🚀 เริ่มต้นเส้นทางการเรียนรู้ของคุณวันนี้</p>
          <p className="text-sm">หากต้องการความช่วยเหลือ กรุณาติดต่อทีมสนับสนุน</p>
        </div>
      </div>
    </div>
  )
}
