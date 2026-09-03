import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Users, Calendar } from 'lucide-react'

export default async function LiveMeetingPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const isAdmin = session.user.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Meeting</h1>
          <p className="text-gray-600">จัดการการประชุมออนไลน์แบบเรียลไทม์</p>
        </div>

        {isAdmin ? (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-6 w-6 text-blue-600" />
                สร้างห้องประชุมใหม่
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">ชื่อห้องประชุม</label>
                  <input 
                    type="text" 
                    placeholder="เช่น: การประชุมประจำสัปดาห์"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">จำนวนผู้เข้าร่วมสูงสุด</label>
                  <input 
                    type="number" 
                    placeholder="50"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">คำอธิบาย</label>
                <textarea 
                  placeholder="รายละเอียดการประชุม..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Video className="h-4 w-4 mr-2" />
                  เริ่มประชุมทันที
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  กำหนดเวลา
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white shadow-sm">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                รอการประชุม
              </h3>
              <p className="text-gray-600">
                ยังไม่มีการประชุมที่กำลังดำเนินการ
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ประวัติการประชุม</h2>
          <Card className="bg-white shadow-sm">
            <CardContent className="text-center py-8">
              <p className="text-gray-500">ยังไม่มีประวัติการประชุม</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}