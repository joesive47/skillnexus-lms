import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Users, Send, Copy, ExternalLink } from 'lucide-react'
import { StartStreamButton } from '@/components/start-stream-button'
import Link from 'next/link'

export default async function InvitationsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const isAdmin = session.user.role === 'ADMIN'
  const isTeacher = session.user.role === 'TEACHER'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Classroom - คำเชิญเข้าห้องเรียน</h1>
          <p className="text-gray-600">จัดการและส่งคำเชิญเข้าห้องเรียนออนไลน์แบบเรียลไทม์</p>
        </div>

        {(isAdmin || isTeacher) && (
          <div className="grid gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Video className="h-6 w-6" />
                  เริ่ม Live Streaming Meeting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">ชื่อห้องเรียน</label>
                    <input 
                      type="text" 
                      placeholder="เช่น: คณิตศาสตร์ ม.3"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      id="roomName"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">รหัสห้อง (ถ้ามี)</label>
                    <input 
                      type="text" 
                      placeholder="ระบุรหัสหรือปล่อยว่าง"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      id="roomCode"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">คำอธิบาย</label>
                  <textarea 
                    placeholder="รายละเอียดการสอน..."
                    rows={2}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    id="description"
                  />
                </div>

                <div className="flex gap-3">
                  <StartStreamButton />
                  <Button variant="outline" id="scheduleBtn">
                    กำหนดเวลา
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-green-600" />
                  ส่งคำเชิญ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">ลิงก์เข้าห้องเรียน</label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="text" 
                      value="https://skillnexus.com/live/room-12345"
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      id="inviteLink"
                    />
                    <Button variant="outline" size="sm" id="copyLinkBtn">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">ส่งคำเชิญไปยังอีเมล</label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="email" 
                      placeholder="student@example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      id="inviteEmail"
                    />
                    <Button className="bg-green-600 hover:bg-green-700 text-white" id="sendInviteBtn">
                      <Send className="h-4 w-4 mr-2" />
                      ส่ง
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              ห้องเรียนที่กำลังดำเนินการ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3" id="activeRooms">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">คณิตศาสตร์ ม.3</h3>
                    <p className="text-sm text-gray-500">ผู้สอน: {session.user.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                        LIVE
                      </span>
                      <span className="text-xs text-gray-500">12 คนกำลังดู</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  เข้าร่วม
                </Button>
              </div>

              <div className="text-center py-8 text-gray-500">
                <p>ไม่มีห้องเรียนที่กำลังดำเนินการอื่น</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>ประวัติการสอน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">ฟิสิกส์ ม.6</h4>
                    <p className="text-sm text-gray-500">เมื่อวาน 14:00 - 15:30 • 25 คนเข้าร่วม</p>
                  </div>
                  <Button variant="outline" size="sm">
                    ดูบันทึก
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">เคมี ม.5</h4>
                    <p className="text-sm text-gray-500">2 วันที่แล้ว 10:00 - 11:30 • 18 คนเข้าร่วม</p>
                  </div>
                  <Button variant="outline" size="sm">
                    ดูบันทึก
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
