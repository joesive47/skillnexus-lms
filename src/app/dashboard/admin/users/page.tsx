import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import UserManagement from "@/components/admin/UserManagement"

export default async function UsersPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // ตรวจสอบสิทธิ์ admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      credits: true,
      createdAt: true,
      _count: {
        select: {
          enrollments: true,
          certificates: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้</h1>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserManagement users={users} />
        </div>
      </div>
    </div>
  )
}