'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

export default function VisitorCounter() {
  const [visitors, setVisitors] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // นับผู้เยี่ยมชม
        const response = await fetch('/api/visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.ok) {
          const data = await response.json()
          setVisitors(data.totalVisitors)
        }
      } catch (error) {
        console.error('Error tracking visitor:', error)
      } finally {
        setLoading(false)
      }
    }

    trackVisitor()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
        <Users className="w-4 h-4" />
        <span>กำลังโหลด...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Users className="w-4 h-4 text-blue-500" />
      <span className="text-gray-300">
        ผู้เยี่ยมชม: <span className="font-bold text-blue-400">{visitors.toLocaleString()}</span> คน
      </span>
    </div>
  )
}
