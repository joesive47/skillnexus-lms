import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, BookOpen, Settings, Award, TrendingUp, Activity, Shield, FileText, Target, BarChart3, Clock } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard")
  }

  const adminModules = [
    {
      title: "จัดการผู้ใช้",
      description: "จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง",
      icon: Users,
      href: "/dashboard/admin/users",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      count: "1,234"
    },
    {
      title: "การเงิน & รายได้",
      description: "รายได้รวมและ Stripe webhook logs",
      icon: DollarSign,
      href: "/dashboard/admin/payments",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      count: "฿125,000"
    },
    {
      title: "จัดการคอร์ส",
      description: "สร้าง แก้ไข และลบคอร์สเรียนทั้งหมด",
      icon: BookOpen,
      href: "/dashboard/admin/courses",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      count: "45"
    },
    {
      title: "ทักษะ & การประเมิน",
      description: "กำหนดทักษะและธนาคารคำถาม",
      icon: Target,
      href: "/dashboard/admin/skills",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      count: "89"
    },
    {
      title: "จัดการแบบทดสอบ",
      description: "สร้างและจัดการแบบทดสอบสำหรับคอร์สเรียน",
      icon: FileText,
      href: "/dashboard/admin/quizzes",
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100",
      count: "24"
    },
    {
      title: "จัดการใบรับรอง",
      description: "ออกและจัดการใบรับรองทักษะและคอร์ส",
      icon: Award,
      href: "/dashboard/admin/certificates",
      gradient: "from-yellow-500 to-yellow-600",
      bgGradient: "from-yellow-50 to-yellow-100",
      count: "156"
    },
    {
      title: "BARD Certificates",
      description: "จัดการใบรับรอง BARD (Behavioral, Aptitude, Role-specific, Development)",
      icon: Award,
      href: "/dashboard/admin/bard-certificates",
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100",
      count: "89"
    },
    {
      title: "Skills Assessment System",
      description: "ระบบประเมินทักษะและการจัดการข้อสอบ",
      icon: Shield,
      href: "/skills-assessment",
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100",
      count: "12"
    },
    {
      title: "จัดการเครดิต",
      description: "เพิ่มเครดิตให้นักเรียนและดูประวัติการใช้งาน",
      icon: DollarSign,
      href: "/dashboard/admin/credits",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      count: "2,450"
    },
    {
      title: "ตั้งค่าระบบ",
      description: "การกำหนดค่า บันทึก และการบำรุงรักษา",
      icon: Settings,
      href: "/dashboard/admin/settings",
      gradient: "from-gray-500 to-gray-600",
      bgGradient: "from-gray-50 to-gray-100",
      count: "12"
    }
  ]

  const stats = [
    {
      title: "ผู้ใช้ทั้งหมด",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "รายได้รวม",
      value: "฿125,000",
      change: "+8%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "คอร์สที่ใช้งาน",
      value: "45",
      change: "+3",
      icon: BookOpen,
      color: "text-purple-600"
    },
    {
      title: "ระบบปลอดภัย",
      value: "99.9%",
      change: "ปกติ",
      icon: Shield,
      color: "text-emerald-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              </div>
              <p className="text-blue-100 text-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                ศูนย์ควบคุมหลัก SkillNexus LMS
              </p>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                <Activity className="relative w-20 h-20 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="group relative overflow-hidden bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600`}>
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.title}</p>
                      </div>
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <p className="text-sm text-green-600 font-semibold">{stat.change}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Admin Modules */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">โมดูลการจัดการ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {adminModules.map((module) => {
              const Icon = module.icon
              return (
                <Link key={module.href} href={module.href}>
                  <Card className="group relative bg-white dark:bg-slate-800 border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden h-full">
                    {/* Gradient Border Top */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${module.gradient}`}></div>
                    
                    {/* Hover Effect Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <CardHeader className="pb-3 pt-5 relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${module.bgGradient} dark:from-slate-700 dark:to-slate-600 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-6 w-6 bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent`} />
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">{module.count}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-5 relative">
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {module.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}