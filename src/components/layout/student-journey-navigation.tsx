'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * A consistent escape hatch for learner pages that do not use StudentSidebar
 * (for example, course lessons and the public certificate view).
 */
export function StudentJourneyNavigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const isStudent = session?.user?.role === 'STUDENT'
  const isPublicEntry = pathname === '/' || pathname === '/login' || pathname === '/register'
  const isStudentDashboard = pathname === '/student/dashboard'
  const isClassroom = /^\/courses\/[^/]+\/lessons(?:\/|$)/.test(pathname)

  if (status !== 'authenticated' || !isStudent || isPublicEntry || isStudentDashboard) {
    return null
  }

  return (
    <nav
      aria-label="การนำทางสำหรับผู้เรียน"
      className={`fixed bottom-4 left-4 z-[9997] flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur sm:bottom-6 ${
        isClassroom ? 'lg:left-[21rem]' : 'lg:left-6'
      }`}
    >
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" />
        ย้อนกลับ
      </Button>
      <Button size="sm" asChild className="gap-1.5">
        <Link href="/student/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </Button>
    </nav>
  )
}
