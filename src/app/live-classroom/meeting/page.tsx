'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, Users, MessageSquare, Send } from 'lucide-react'
import { WebRTCManager } from '@/lib/streaming/webrtc-manager'

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
}

export default function LiveMeetingPage() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [participants, setParticipants] = useState<string[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const webrtcRef = useRef<WebRTCManager | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    webrtcRef.current = new WebRTCManager()
    startLocalStream()
    
    return () => {
      webrtcRef.current?.closeAllConnections()
    }
  }, [])

  const startLocalStream = async () => {
    try {
      const stream = await webrtcRef.current?.startLocalStream({
        video: true,
        audio: true
      })
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error starting stream:', error)
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    // TODO: Toggle video track
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
    // TODO: Toggle audio track
  }

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await webrtcRef.current?.startLocalStream({
          video: true,
          audio: true,
          screen: true
        })
        if (localVideoRef.current && stream) {
          localVideoRef.current.srcObject = stream
        }
        setIsScreenSharing(true)
      } catch (error) {
        console.error('Error sharing screen:', error)
      }
    } else {
      startLocalStream()
      setIsScreenSharing(false)
    }
  }

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: messageInput,
        timestamp: new Date()
      }
      setChatMessages([...chatMessages, newMessage])
      setMessageInput('')
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const endCall = () => {
    webrtcRef.current?.closeAllConnections()
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className={showChat ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0 relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[600px] bg-black rounded-t-lg object-cover"
                />
                
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg border-2 border-white object-cover"
                />

                <div className="absolute top-4 left-4">
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <Button
                    onClick={toggleVideo}
                    variant={isVideoOn ? 'default' : 'destructive'}
                    size="lg"
                    className="rounded-full w-14 h-14"
                  >
                    {isVideoOn ? <Video /> : <VideoOff />}
                  </Button>

                  <Button
                    onClick={toggleAudio}
                    variant={isAudioOn ? 'default' : 'destructive'}
                    size="lg"
                    className="rounded-full w-14 h-14"
                  >
                    {isAudioOn ? <Mic /> : <MicOff />}
                  </Button>

                  <Button
                    onClick={toggleScreenShare}
                    variant={isScreenSharing ? 'secondary' : 'default'}
                    size="lg"
                    className="rounded-full w-14 h-14"
                    title="Share Screen"
                  >
                    <Monitor />
                  </Button>

                  <Button
                    onClick={() => setShowChat(!showChat)}
                    variant={showChat ? 'secondary' : 'default'}
                    size="lg"
                    className="rounded-full w-14 h-14"
                    title="Toggle Chat"
                  >
                    <MessageSquare />
                  </Button>

                  <Button
                    onClick={endCall}
                    variant="destructive"
                    size="lg"
                    className="rounded-full w-14 h-14"
                  >
                    <PhoneOff />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {showChat && (
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Chat
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowChat(false)}
                      className="text-white"
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm mt-8">
                        No messages yet
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div key={msg.id} className="bg-gray-700 rounded p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-blue-400 text-sm font-semibold">{msg.user}</span>
                            <span className="text-gray-400 text-xs">
                              {msg.timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-white text-sm">{msg.message}</p>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex gap-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Button onClick={sendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
