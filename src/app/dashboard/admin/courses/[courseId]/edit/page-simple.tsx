import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

interface EditCoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  try {
    const { courseId } = await params
    
    // Fetch course with minimal fields
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        published: true
      }
    })
    
    if (!course) {
      notFound()
    }

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>แก้ไขคอร์ส: {course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Course ID:</strong> {course.id}
              </div>
              <div>
                <strong>Title:</strong> {course.title}
              </div>
              <div>
                <strong>Description:</strong> {course.description || 'N/A'}
              </div>
              <div>
                <strong>Published:</strong> {course.published ? 'Yes' : 'No'}
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  ⚠️ This is a simplified version for debugging. 
                  The full editing interface will be restored once the error is fixed.
                </p>
              </div>
            </CardContent>
          </Card>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('[COURSE_EDIT_ERROR]', error)
    throw error
  }
}
