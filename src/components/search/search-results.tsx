'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Play, FileText, Users } from 'lucide-react'

interface SearchResult {
  courses: Array<{
    id: string
    title: string
    description: string
    price: number
    imageUrl?: string
    _count: { lessons: number; enrollments: number }
  }>
  lessons: Array<{
    id: string
    title: string
    type: string
    courseId: string
    course: { title: string }
  }>
  quizzes: Array<{
    id: string
    title: string
    courseId: string
    course: { title: string }
    _count: { questions: number }
  }>
}

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) return

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  if (!query) {
    return <div className="text-center py-8 text-gray-500">กรุณาใส่คำค้นหา</div>
  }

  if (loading) {
    return <div className="text-center py-8">กำลังค้นหา...</div>
  }

  if (!results) {
    return <div className="text-center py-8 text-red-500">เกิดข้อผิดพลาดในการค้นหา</div>
  }

  const totalResults = results.courses.length + results.lessons.length + results.quizzes.length

  return (
    <div className="space-y-8">
      <div className="text-gray-600">
        พบ {totalResults} ผลลัพธ์สำหรับ "{query}"
      </div>

      {results.courses.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            คอร์ส ({results.courses.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {course._count.lessons} บทเรียน
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course._count.enrollments} คน
                  </span>
                </div>
                {course.price > 0 && (
                  <div className="mt-2 text-green-600 font-semibold">
                    ฿{course.price.toLocaleString()}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.lessons.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Play className="w-6 h-6" />
            บทเรียน ({results.lessons.length})
          </h2>
          <div className="space-y-4">
            {results.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/courses/${lesson.courseId}/lessons/${lesson.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
              >
                <h3 className="font-semibold mb-2">{lesson.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  จากคอร์ส: {lesson.course.title}
                </p>
                <div className="mt-2 text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded inline-block">
                  {lesson.type === 'VIDEO' ? 'วิดีโอ' : 'แบบทดสอบ'}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.quizzes.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            แบบทดสอบ ({results.quizzes.length})
          </h2>
          <div className="space-y-4">
            {results.quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/courses/${quiz.courseId}/quiz/${quiz.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
              >
                <h3 className="font-semibold mb-2">{quiz.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  จากคอร์ส: {quiz.course.title}
                </p>
                <div className="mt-2 text-xs text-green-600 bg-green-100 dark:bg-green-900 px-2 py-1 rounded inline-block">
                  {quiz._count.questions} คำถาม
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalResults === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">ไม่พบผลการค้นหาสำหรับ "{query}"</div>
          <div className="text-sm text-gray-400">
            ลองใช้คำค้นหาอื่น หรือตรวจสอบการสะกดคำ
          </div>
        </div>
      )}
    </div>
  )
}