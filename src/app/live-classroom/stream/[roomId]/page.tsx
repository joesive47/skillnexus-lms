'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Video, Mic, MicOff, VideoOff, Users, MessageSquare, Share2, PhoneOff } from 'lucide-react'
import { useState } from 'react'

export default function StreamPage() {
  const params = useParams()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col h-screen">
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-semibold">Live Classroom - Room {params.roomId}</h1>
              <p className="text-gray-400 text-sm">12 คนกำลังดู</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black flex items-center justify-center relative">
              <div className="text-center">
                <Video className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">กล้องของคุณ</p>
              </div>
              
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full">
                  <Button
                    size="sm"
                    variant={isMuted ? "destructive" : "secondary"}
                    className="rounded-full w-12 h-12"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={isVideoOff ? "destructive" : "secondary"}
                    className="rounded-full w-12 h-12"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                  
                  <Button size="sm" variant="secondary" className="rounded-full w-12 h-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  
                  <Button size="sm" variant="destructive" className="rounded-full w-12 h-12">
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-white font-medium">ผู้เข้าร่วม (12)</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <h2 className="text-white font-semibold">แชท</h2>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-sm font-medium text-white">นักเรียน 1</p>
                <p className="text-sm text-gray-300 mt-1">สวัสดีครับ</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-sm font-medium text-white">นักเรียน 2</p>
                <p className="text-sm text-gray-300 mt-1">เข้าใจแล้วครับ</p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความ..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">ส่ง</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}