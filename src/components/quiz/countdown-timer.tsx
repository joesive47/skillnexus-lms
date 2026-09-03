'use client'

import { useEffect, useState } from 'react'
import { Clock, RefreshCw } from 'lucide-react'

interface CountdownTimerProps {
  targetSeconds: number // จำนวนวินาทีที่ต้องนับถอยหลัง
  onComplete?: () => void // Callback เมื่อนับเสร็จ (0 วินาที)
  autoRefresh?: boolean // Auto refresh หน้าเมื่อนับเสร็จ
}

export function CountdownTimer({ 
  targetSeconds, 
  onComplete, 
  autoRefresh = false 
}: CountdownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(targetSeconds)

  useEffect(() => {
    setRemainingSeconds(targetSeconds)
  }, [targetSeconds])

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onComplete?.()
      if (autoRefresh) {
        window.location.reload()
      }
      return
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [remainingSeconds, onComplete, autoRefresh])

  // แปลงวินาทีเป็น นาที:วินาที
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  // แปลงเป็น ชั่วโมง:นาที:วินาที สำหรับ delay ยาว
  const hours = Math.floor(minutes / 60)
  const displayMinutes = minutes % 60

  if (remainingSeconds <= 0) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <RefreshCw className="h-4 w-4" />
        <span>พร้อมทำแบบทดสอบแล้ว</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-orange-600 font-mono">
      <Clock className="h-4 w-4 animate-pulse" />
      <span className="text-lg font-semibold">
        {hours > 0 && (
          <>
            {hours.toString().padStart(2, '0')}
            <span className="text-orange-400">:</span>
          </>
        )}
        {displayMinutes.toString().padStart(2, '0')}
        <span className="text-orange-400">:</span>
        {seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
