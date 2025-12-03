import AssignmentManager from '@/components/assignment/AssignmentManager'
import LiveChat from '@/components/chat/LiveChat'

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <AssignmentManager />
      <LiveChat />
    </div>
  )
}

export const metadata = {
  title: 'Assignments - SkillNexus LMS',
  description: 'Manage your homework and projects',
}