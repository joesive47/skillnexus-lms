import { Suspense } from 'react'
import VirtualClassroom from '@/components/live-streaming/VirtualClassroom'
import { Card, CardContent } from '@/components/ui/card'

export default function LiveClassroomPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-white">กำลังเข้าสู่ห้องเรียนออนไลน์...</p>
            </CardContent>
          </Card>
        </div>
      }>
        <VirtualClassroom
          classroomId="classroom-1"
          streamId="stream-1"
          title="JavaScript Fundamentals - Live Session"
          instructor="นายทวีศักดิ์ เจริญศิลป์"
          isLive={true}
        />
      </Suspense>
    </div>
  )
}