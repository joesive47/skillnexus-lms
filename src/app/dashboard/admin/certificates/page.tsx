import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from '@/lib/prisma'
import CertificateTemplateSelector from '@/components/admin/CertificateTemplateSelector'

export default async function AdminCertificatesPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect("/login")
  }

  const courses = await prisma.course.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      description: true,
      _count: {
        select: {
          certificates: true,
          enrollments: true
        }
      }
    },
    orderBy: { title: 'asc' }
  })

  const certificates = await prisma.certificate.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { issuedAt: 'desc' },
    take: 10
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">จัดการใบประกาศนียบัตร</h1>
        <p className="text-muted-foreground">เลือกแบบฟอร์มใบประกาศนียบัตรและเชื่อมโยงกับหลักสูตร</p>
      </div>

      <CertificateTemplateSelector courses={courses} certificates={certificates} />
    </div>
  )
}