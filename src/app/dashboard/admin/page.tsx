import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, BookOpen, Settings, Award, TrendingUp, Activity, Shield, FileText, Target } from "lucide-react"
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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
            <p className="text-blue-100 text-lg">ศูนย์ควบคุมหลักสำหรับ SkillNexus LMS</p>
          </div>
          <div className="hidden md:block">
            <Activity className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Admin Modules */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">โมดูลการจัดการ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.href} href={module.href}>
                <Card className="group bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${module.gradient}`}></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${module.bgGradient} dark:from-slate-700 dark:to-slate-600`}>
                        <Icon className={`h-6 w-6 bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent`} />
                      </div>
                      <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">{module.count}</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed">
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
  )
}