'use client'

import { useEffect, useState } from 'react'

export default function VisitorCounter() {
  const [visitors, setVisitors] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Increment visitor count
    fetch('/api/visitors', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setVisitors(data.count)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-200 rounded-lg px-4 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">👥</span>
        <div>
          <p className="text-xs text-gray-500">ผู้เข้าชม</p>
          <p className="text-lg font-bold text-gray-900">{visitors.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
