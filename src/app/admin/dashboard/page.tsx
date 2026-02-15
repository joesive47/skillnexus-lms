import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Award, Settings } from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View Stats</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View All</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Configure</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/users" className="block p-2 hover:bg-gray-100 rounded text-sm">
              👥 Manage Users
            </Link>
            <Link href="/dashboard/admin/credits" className="block p-2 hover:bg-gray-100 rounded text-sm">
              💰 Manage Credits
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/courses" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📚 Manage Courses
            </Link>
            <Link href="/dashboard/admin/courses/new" className="block p-2 hover:bg-gray-100 rounded text-sm">
              ➕ Create Course
            </Link>
            <Link href="/dashboard/admin/quizzes" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📝 Manage Quizzes
            </Link>
            <Link href="/dashboard/admin/scorm" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📦 SCORM Packages
            </Link>
            <Link href="/dashboard/admin/interactive" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🎮 Interactive Content
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificates & Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/certifications" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🏆 Certification System
            </Link>
            <Link href="/dashboard/admin/certificates" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📜 Legacy Certificates
            </Link>
            <Link href="/dashboard/admin/bard-certificates" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🎖️ BARD Certificates
            </Link>
            <Link href="/dashboard/admin/badges" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🥇 Legacy Badges
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI & Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/chatbot" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🤖 Chatbot Management
            </Link>
            <Link href="/dashboard/rag-management" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📄 RAG Documents
            </Link>
            <Link href="/ai-learning" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🧠 AI Learning
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/skills-assessment" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📊 Skills Assessment
            </Link>
            <Link href="/dashboard/admin/voice-assignments" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🎤 Voice Assignments
            </Link>
            <Link href="/dashboard/admin/skills-assessment" className="block p-2 hover:bg-gray-100 rounded text-sm">
              ⚙️ Manage Assessments
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments & Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/payments" className="block p-2 hover:bg-gray-100 rounded text-sm">
              💳 Payments
            </Link>
            <Link href="/dashboard/admin/files" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📁 File Manager
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enterprise Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/enterprise/dashboard" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🏢 Enterprise Dashboard
            </Link>
            <Link href="/enterprise/tenant-management" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🏛️ Tenant Management
            </Link>
            <Link href="/enterprise/audit-logs" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📋 Audit Logs
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics & Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/analytics" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📈 Analytics
            </Link>
            <Link href="/performance" className="block p-2 hover:bg-gray-100 rounded text-sm">
              ⚡ Performance
            </Link>
            <Link href="/system-status" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🔧 System Status
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/live-sessions" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📹 Live Sessions
            </Link>
            <Link href="/dashboard/classrooms" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🏫 Classrooms
            </Link>
            <Link href="/learning-paths" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🛤️ Learning Paths
            </Link>
            <Link href="/social-learning" className="block p-2 hover:bg-gray-100 rounded text-sm">
              👥 Social Learning
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
