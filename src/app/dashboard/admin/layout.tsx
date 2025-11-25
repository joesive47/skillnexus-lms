import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard/admin" className="text-xl font-bold">
                Admin Panel
              </Link>
              <div className="flex space-x-4">
                <Link href="/dashboard/admin/courses">
                  <Button variant="ghost">Courses</Button>
                </Link>
                <Link href="/dashboard/admin/users">
                  <Button variant="ghost">Users</Button>
                </Link>
                <Link href="/dashboard/admin/quizzes">
                  <Button variant="ghost">Quizzes</Button>
                </Link>
                <Link href="/dashboard/admin/skills-assessment">
                  <Button variant="ghost">Skills Assessment</Button>
                </Link>
                <Link href="/dashboard/admin/chatbot">
                  <Button variant="ghost">Chatbot</Button>
                </Link>
                <Link href="/dashboard/admin/scorm">
                  <Button variant="ghost">SCORM</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}