import GradebookManager from '@/components/gradebook/GradebookManager'

export default function GradebookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <GradebookManager />
    </div>
  )
}

export const metadata = {
  title: 'Gradebook - SkillNexus LMS',
  description: 'Track your grades and academic performance',
}