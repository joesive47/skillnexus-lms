'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { StudentJourneyNavigation } from '@/components/layout/student-journey-navigation'

const UnifiedChatWidget = dynamic(
  () => import('@/components/chatbot/UnifiedChatWidget').catch((err) => {
    console.error('Failed to load UnifiedChatWidget:', err)
    // Return a fallback component
    return { default: () => null }
  }),
  {
    ssr: false,
    loading: () => null
  }
)

const NotificationCenter = dynamic(
  () => import('@/components/notifications/notification-center').then(mod => ({ default: mod.NotificationCenter })),
  {
    ssr: false,
    loading: () => null
  }
)

export default function GlobalWidgets() {
  const pathname = usePathname()
  const isPublicEntry = pathname === '/' || pathname === '/login' || pathname === '/register'
  const isPublicCertificate = pathname.startsWith('/certificates/')
  const isSkillAssessment = pathname.startsWith('/skills-assessment')

  // Authentication and marketing pages should stay lightweight. These widgets
  // load chatbot/notification bundles and may poll session APIs even though the
  // visitor has not entered the LMS yet.
  if (isPublicEntry) return null

  return (
    <>
      <StudentJourneyNavigation />

      {!isPublicCertificate && (
        <>
          {/* Notification Center - Fixed Position Top Right */}
          <div className="fixed top-4 right-4 z-[9999]">
            <Suspense fallback={null}>
              <NotificationCenter />
            </Suspense>
          </div>

          {/* Do not show a second link while the learner is already on this page. */}
          {!isSkillAssessment && (
            <Link
              href="/skills-assessment"
              className="fixed bottom-6 right-24 z-[9998] w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              title="ทดสอบทักษะ"
            >
              <span className="text-xl">🎯</span>
            </Link>
          )}

          {/* Chatbot Widget - Available inside the LMS, not on public verification pages. */}
          <Suspense fallback={null}>
            <UnifiedChatWidget />
          </Suspense>
        </>
      )}
    </>
  )
}
