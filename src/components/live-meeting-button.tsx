'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

export function LiveMeetingButton() {
  const [loading, setLoading] = useState(false)

  const startMeeting = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/live-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Live Meeting',
          description: 'Quick meeting',
          maxParticipants: 50
        })
      })

      const data = await response.json()
      
      if (data.success) {
        window.open(data.data.url, '_blank')
      }
    } catch (error) {
      console.error('Error starting meeting:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={startMeeting} 
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Video className="h-4 w-4 mr-2" />
      {loading ? 'กำลังเริ่ม...' : 'เริ่มประชุม'}
    </Button>
  )
}