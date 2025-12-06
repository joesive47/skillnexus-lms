import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  // Redirect based on role
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/dashboard')
  }
  if (session?.user?.role === 'TEACHER') {
    redirect('/teacher/dashboard')
  }
  if (session?.user?.role === 'STUDENT') {
    redirect('/student/dashboard')
  }
  
  // If no session, redirect to login
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to SkillNexus LMS</p>
      <p>User: {session.user?.email}</p>
      <p>Role: {session.user?.role}</p>
    </div>
  )
}