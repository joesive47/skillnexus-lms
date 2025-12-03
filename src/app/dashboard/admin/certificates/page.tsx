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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">จัดการใบประกาศนียบัตร</h1>
          <p className="text-muted-foreground">เลือกระบบใบประกาศนียบัตร</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <a href="/bard-certification" className="block p-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition">
          <div className="text-4xl mb-3">🔑</div>
          <h3 className="text-2xl font-bold mb-2">BARD Certification System</h3>
          <p className="text-purple-100">ระบบใบประกาศนียบัตรแบบ Keys - รวมหลายคอร์สเป็น Master Certificate</p>
          <div className="mt-4 text-sm bg-white/20 px-3 py-1 rounded inline-block">แนะนำ ⭐</div>
        </a>

        <div className="p-6 bg-gray-100 rounded-lg border-2 border-gray-300 opacity-50">
          <div className="text-4xl mb-3">📜</div>
          <h3 className="text-2xl font-bold mb-2 text-gray-600">Traditional Certificate</h3>
          <p className="text-gray-500">ระบบใบประกาศนียบัตรแบบเดิม (ซ่อนไว้)</p>
          <div className="mt-4 text-sm bg-gray-300 px-3 py-1 rounded inline-block">ไม่แนะนำ</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-bold mb-4">ใบประกาศนียบัตรล่าสุด (BARD System)</h2>
        <div className="space-y-2">
          {certificates.slice(0, 5).map(cert => (
            <div key={cert.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-semibold">{cert.user.name}</div>
                <div className="text-sm text-gray-600">{cert.course.title}</div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(cert.issuedAt).toLocaleDateString('th-TH')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}