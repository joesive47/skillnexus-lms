import { redirect } from 'next/navigation'

// Legacy teacher entry point. The Instructor Portal is the single supported
// workspace for course ownership and editing.
export default function LegacyTeacherDashboardPage() {
  redirect('/instructor/dashboard')
}
