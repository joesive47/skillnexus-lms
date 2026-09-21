import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/access-control'
import { LearningIntelligenceDashboard } from '@/components/admin/learning-intelligence-dashboard'

export const dynamic = 'force-dynamic'

export default async function AdminLearningAnalyticsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl"><LearningIntelligenceDashboard /></div>
    </main>
  )
}
