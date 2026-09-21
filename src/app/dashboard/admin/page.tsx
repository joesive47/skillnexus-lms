import { auth } from '@/auth'
import { UserRole } from '@/lib/types'
import { redirect } from 'next/navigation'

/**
 * The previous dashboard contained placeholder KPIs. Route administrators to
 * the live, database-backed Learning Intelligence dashboard instead, so there
 * is only one authoritative view of operational data.
 */
export default async function AdminDashboard() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard')
  }

  redirect('/dashboard/admin/analytics')
}
