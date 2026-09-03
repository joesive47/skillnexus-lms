"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Welcome Page - Legacy redirect handler
 * This page immediately redirects users to their role-appropriate dashboard
 * Kept for backward compatibility with old links
 */
export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // IMMEDIATE redirect based on authentication and role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.role) {
      const role = session.user.role
      let targetPath = '/dashboard' // Default for STUDENT

      if (role === 'ADMIN') {
        targetPath = '/admin/dashboard'
      } else if (role === 'TEACHER') {
        targetPath = '/teacher/dashboard'
      }

      // Immediate redirect - no delay
      router.replace(targetPath)
    }
  }, [status, session, router])

  // Show minimal loading state during redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">กำลังเปลี่ยนเส้นทาง...</h2>
        <p className="text-gray-600">กำลังนำคุไปยังหน้าที่เหมาะสม</p>
      </div>
    </div>
  )
}
