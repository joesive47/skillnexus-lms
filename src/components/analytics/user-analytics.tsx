'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function UserAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    const track = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'page_view',
            page: pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        })
      } catch (error) {
        console.error('Analytics error:', error)
      }
    }
    track()
  }, [pathname])

  return null
}
