import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

export const metadata = {
  title: 'Analytics Dashboard - SkillNexus',
  description: 'Learning analytics and insights'
}

export default async function AnalyticsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Check if user is admin or teacher
  const isAdminOrTeacher = ['ADMIN', 'TEACHER'].includes(session.user.role || '')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdminOrTeacher ? 'Analytics Dashboard' : 'My Learning Analytics'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isAdminOrTeacher 
              ? 'Overview of platform performance and user activity'
              : 'Track your learning progress and achievements'
            }
          </p>
        </div>

        {/* Dashboard Component */}
        <AnalyticsDashboard userRole={session.user.role} />
      </div>
    </div>
  )
}
