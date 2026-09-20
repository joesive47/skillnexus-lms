import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { InstructorSidebar } from '@/components/layout/instructor-sidebar'

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <InstructorSidebar />
      <main className="pt-14 lg:pt-0 lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
