'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageSquare, 
  Users, 
  Hand, 
  Share, 
  Settings,
  Phone,
  PhoneOff,
  Monitor
} from 'lucide-react'
import LiveStreamPlayer from './LiveStreamPlayer'

interface Participant {
  id: string
  name: string
  role: 'instructor' | 'student'
  isVideoOn: boolean
  isAudioOn: boolean
  isHandRaised: boolean
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  type: 'message' | 'system'
}

interface VirtualClassroomProps {
  classroomId: string
  streamId: string
  title: string
  instructor: string
  isLive: boolean
}

export default function VirtualClassroom({
  classroomId,
  streamId,
  title,
  instructor,
  isLive
}: VirtualClassroomProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)

  useEffect(() => {
    // Simulate participants
    setParticipants([
      {
        id: '1',
        name: instructor,
        role: 'instructor',
        isVideoOn: true,
        isAudioOn: true,
        isHandRaised: false
      },
      {
        id: '2',
        name: 'นักเรียน A',
        role: 'student',
        isVideoOn: false,
        isAudioOn: false,
        isHandRaised: false
      },
      {
        id: '3',
        name: 'นักเรียน B',
        role: 'student',
        isVideoOn: true,
        isAudioOn: false,
        isHandRaised: true
      }
    ])

    setViewerCount(Math.floor(Math.random() * 100) + 20)

    // Simulate chat messages
    setChatMessages([
      {
        id: '1',
        userId: '1',
        userName: instructor,
        message: 'ยินดีต้อนรับทุกคนเข้าสู่ห้องเรียนออนไลน์',
        timestamp: new Date(),
        type: 'message'
      },
      {
        id: '2',
        userId: 'system',
        userName: 'System',
        message: 'นักเรียน A เข้าร่วมห้องเรียน',
        timestamp: new Date(),
        type: 'system'
      }
    ])
  }, [instructor])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'คุณ',
        message: newMessage,
        timestamp: new Date(),
        type: 'message'
      }
      setChatMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
  }

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised)
  }

  const joinClassroom = () => {
    setIsConnected(true)
  }

  const leaveClassroom = () => {
    setIsConnected(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen">
          {/* Main Video Area */}
          <div className="lg:col-span-3 space-y-4">
            <LiveStreamPlayer
              streamId={streamId}
              title={title}
              instructor={instructor}
              isLive={isLive}
              viewerCount={viewerCount}
              onJoin={joinClassroom}
            />

            {/* Control Panel */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isVideoOn ? "default" : "secondary"}
                      size="sm"
                      onClick={toggleVideo}
                      className={isVideoOn ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      variant={isAudioOn ? "default" : "secondary"}
                      size="sm"
                      onClick={toggleAudio}
                      className={isAudioOn ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>

                    <Button
                      variant={isHandRaised ? "default" : "outline"}
                      size="sm"
                      onClick={toggleHandRaise}
                      className={isHandRaised ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                    >
                      <Hand className="w-4 h-4" />
                    </Button>

                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-1" />
                      แชร์หน้าจอ
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-gray-700">
                      <Users className="w-3 h-3 mr-1" />
                      {participants.length} คน
                    </Badge>
                    
                    {isConnected ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={leaveClassroom}
                      >
                        <PhoneOff className="w-4 h-4 mr-1" />
                        ออกจากห้อง
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={joinClassroom}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        เข้าร่วม
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Participants */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  ผู้เข้าร่วม ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-48">
                  <div className="p-3 space-y-2">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {participant.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{participant.name}</p>
                            {participant.role === 'instructor' && (
                              <Badge variant="secondary" className="text-xs bg-blue-600">
                                ครู
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {participant.isHandRaised && (
                            <Hand className="w-3 h-3 text-yellow-400" />
                          )}
                          {participant.isVideoOn ? (
                            <Video className="w-3 h-3 text-green-400" />
                          ) : (
                            <VideoOff className="w-3 h-3 text-gray-500" />
                          )}
                          {participant.isAudioOn ? (
                            <Mic className="w-3 h-3 text-green-400" />
                          ) : (
                            <MicOff className="w-3 h-3 text-gray-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="bg-gray-800 border-gray-700 flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  แชท
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-96">
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="space-y-1">
                        {message.type === 'system' ? (
                          <div className="text-center">
                            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                              {message.message}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-purple-400">
                                {message.userName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString('th-TH', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 bg-gray-700/50 p-2 rounded">
                              {message.message}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="พิมพ์ข้อความ..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button size="sm" onClick={sendMessage}>
                      ส่ง
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}