'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SearchResult {
  courses: Array<{
    id: string
    title: string
    description: string
    price: number
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

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults(null)
      setIsOpen(false)
      return
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results)
        setIsOpen(true)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="ค้นหาคอร์ส บทเรียน..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults(null)
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">กำลังค้นหา...</div>
          ) : results ? (
            <div className="p-2">
              {results.courses.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2 py-1">คอร์ส</h3>
                  {results.courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="font-medium text-sm">{course.title}</div>
                      <div className="text-xs text-gray-500 truncate">{course.description}</div>
                      <div className="text-xs text-blue-600">{course._count.lessons} บทเรียน</div>
                    </Link>
                  ))}
                </div>
              )}

              {results.lessons.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2 py-1">บทเรียน</h3>
                  {results.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${lesson.courseId}/lessons/${lesson.id}`}
                      className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="font-medium text-sm">{lesson.title}</div>
                      <div className="text-xs text-gray-500">จาก: {lesson.course.title}</div>
                    </Link>
                  ))}
                </div>
              )}

              {results.quizzes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2 py-1">แบบทดสอบ</h3>
                  {results.quizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      href={`/courses/${quiz.courseId}/quiz/${quiz.id}`}
                      className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="font-medium text-sm">{quiz.title}</div>
                      <div className="text-xs text-gray-500">จาก: {quiz.course.title}</div>
                      <div className="text-xs text-green-600">{quiz._count.questions} คำถาม</div>
                    </Link>
                  ))}
                </div>
              )}

              {results.courses.length === 0 && results.lessons.length === 0 && results.quizzes.length === 0 && (
                <div className="p-4 text-center text-gray-500">ไม่พบผลการค้นหา</div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="block px-2 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-center"
                  onClick={() => setIsOpen(false)}
                >
                  ดูผลการค้นหาทั้งหมด
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}