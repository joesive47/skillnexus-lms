'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function StartStreamButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const startStream = async () => {
    setLoading(true)
    try {
      const roomName = (document.getElementById('roomName') as HTMLInputElement)?.value || 'Live Class'
      const roomCode = (document.getElementById('roomCode') as HTMLInputElement)?.value
      const description = (document.getElementById('description') as HTMLTextAreaElement)?.value

      const response = await fetch('/api/live-classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, roomCode, description })
      })

      const data = await response.json()
      
      if (data.success) {
        router.push(`/live-classroom/stream/${data.data.id}`)
      }
    } catch (error) {
      console.error('Error starting stream:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={startStream} 
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Video className="h-4 w-4 mr-2" />
      {loading ? 'กำลังเริ่ม...' : 'เริ่ม Live Stream'}
    </Button>
  )
}