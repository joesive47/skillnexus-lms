import { LessonManager } from '@/components/course/lesson-manager'

interface NewLessonPageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function NewLessonPage({ params }: NewLessonPageProps) {
  const { courseId } = await params

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">เพิ่มบทเรียนใหม่</h1>
        <p className="text-muted-foreground mt-2">
          สร้างบทเรียนประเภท Video, Quiz, Text หรือ SCORM
        </p>
      </div>
      
      <LessonManager courseId={courseId} moduleId="" />
    </div>
  )
}
