import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Database, Shield, Mail } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          ตั้งค่าระบบ
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              การตั้งค่าฐานข้อมูล
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">จัดการการเชื่อมต่อและการสำรองข้อมูล</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              การตั้งค่าความปลอดภัย
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">จัดการการรักษาความปลอดภัยของระบบ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              การตั้งค่าอีเมล
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">จัดการการส่งอีเมลและการแจ้งเตือน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              การตั้งค่าทั่วไป
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">จัดการการตั้งค่าพื้นฐานของระบบ</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}