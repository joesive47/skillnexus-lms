import { redirect } from 'next/navigation'
import { CourseForm } from '@/components/course/course-form'
import { getActiveCourseCategoryTree } from '@/lib/course-categories'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireAdminOrTeacher } from '@/lib/access-control'

export default async function InstructorNewCoursePage() {
  try {
    await requireAdminOrTeacher()
  } catch {
    redirect('/login')
  }

  const categories = await getActiveCourseCategoryTree()

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/instructor/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">สร้างหลักสูตรใหม่</h1>
        <p className="text-sm text-gray-500 mt-1">กรอกข้อมูลหลักสูตรและเพิ่มบทเรียน</p>
      </div>
      <CourseForm mode="create" categories={categories} redirectPath="/instructor/dashboard" />
    </div>
  )
}
