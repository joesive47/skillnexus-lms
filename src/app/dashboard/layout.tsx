import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import Link from "next/link"
import { Home, Users, DollarSign, BookOpen, Settings, Award, LogOut, BarChart3, FileText, GraduationCap, ClipboardList, FolderOpen, Bot, School, Coins, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { handleSignOut } from "@/app/actions/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const navigationItems = [
    { name: "หน้าแรก", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    
    // Student Menu
    ...(session.user.role === UserRole.STUDENT ? [
      { name: "คอร์สของฉัน", href: "/dashboard/student", icon: BookOpen },
      { name: "ใบประกาศนียบัตร BARD", href: "/dashboard/student/bard-certificates", icon: Award },
      { name: "ห้องเรียน", href: "/dashboard/classrooms", icon: School },
      { name: "เครดิตของฉัน", href: "/dashboard/credits", icon: Coins },
    ] : []),
    
    // Teacher Menu
    ...(session.user.role === UserRole.TEACHER ? [
      { name: "สอนคอร์ส", href: "/dashboard/teacher", icon: GraduationCap },
      { name: "ห้องเรียน", href: "/dashboard/classrooms", icon: School },
      { name: "ใบประกาศนียบัตร", href: "/dashboard/certificates", icon: FileText },
    ] : []),
    
    // Admin Menu
    ...(session.user.role === UserRole.ADMIN ? [
      { name: "จัดการผู้ใช้", href: "/dashboard/admin/users", icon: Users },
      { name: "จัดการคอร์ส", href: "/dashboard/admin/courses", icon: BookOpen },
      { name: "การเงิน", href: "/dashboard/admin/payments", icon: DollarSign },
      { name: "ใบประกาศนียบัตร BARD", href: "/dashboard/admin/bard-certificates", icon: Award },
      { name: "การจัดการข้อสอบ", href: "/dashboard/admin/quizzes", icon: ClipboardList },
      { name: "ห้องเรียน", href: "/dashboard/classrooms", icon: School },
      { name: "จัดการไฟล์", href: "/dashboard/admin/files", icon: FolderOpen },
      { name: "จัดการ Chatbot", href: "/dashboard/chatbot", icon: Bot },
      { name: "ทักษะ & การประเมิน", href: "/dashboard/admin/skills", icon: GraduationCap },
      { name: "ตั้งค่าระบบ", href: "/dashboard/admin/settings", icon: Settings },
    ] : [])
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-slate-200 dark:border-slate-700">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SN</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillNexus
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {session.user.name || session.user.email}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {session.user.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group"
              >
                <Icon className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <form action={handleSignOut}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              ออกจากระบบ
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}