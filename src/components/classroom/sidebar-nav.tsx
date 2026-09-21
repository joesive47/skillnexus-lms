'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Lock, CheckCircle, Play, FileText, Package, Gamepad2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { OutlineRes } from '@/lib/data'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  outline: OutlineRes
  courseId: string
}

export function SidebarNav({ outline, courseId }: SidebarNavProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [locallyCompletedLessonIds, setLocallyCompletedLessonIds] = useState<Set<string>>(new Set())

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`skillnexus:sidebar:${courseId}`)
    if (saved) {
      setCollapsedSections(new Set(JSON.parse(saved)))
    }
    setLocallyCompletedLessonIds(new Set())
  }, [courseId])

  // A quiz result is already stored on the server when this event fires. Keep
  // the result screen mounted and update only the classroom navigation, so a
  // learner can continue immediately without reloading the whole route.
  useEffect(() => {
    const handleLessonCompleted = (event: Event) => {
      const detail = (event as CustomEvent<{ courseId?: string; lessonId?: string }>).detail
      const lessonId = detail?.lessonId
      if (detail?.courseId !== courseId || !lessonId) return

      setLocallyCompletedLessonIds(current => {
        if (current.has(lessonId)) return current
        const next = new Set(current)
        next.add(lessonId)
        return next
      })
    }

    window.addEventListener('skillnexus:lesson-completed', handleLessonCompleted)
    return () => window.removeEventListener('skillnexus:lesson-completed', handleLessonCompleted)
  }, [courseId])

  // Save collapsed state to localStorage
  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId)
    } else {
      newCollapsed.add(sectionId)
    }
    setCollapsedSections(newCollapsed)
    localStorage.setItem(`skillnexus:sidebar:${courseId}`, JSON.stringify([...newCollapsed]))
  }

  const displaySections = locallyCompletedLessonIds.size === 0
    ? outline.sections
    : (() => {
        const completedLessonIds = new Set(
          outline.sections.flatMap(section =>
            section.lessons.filter(lesson => lesson.isCompleted).map(lesson => lesson.id)
          )
        )
        locallyCompletedLessonIds.forEach(lessonId => completedLessonIds.add(lessonId))
        let hasIncompletePredecessor = false

        return outline.sections.map(section => ({
          ...section,
          lessons: section.lessons.map(lesson => {
            const isCompleted = completedLessonIds.has(lesson.id)
            const isLocked = hasIncompletePredecessor
            if (!isCompleted) hasIncompletePredecessor = true
            return { ...lesson, isCompleted, isLocked }
          })
        }))
      })()

  // Filter lessons based on search
  const filteredSections = displaySections.map(section => ({
    ...section,
    lessons: section.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.lessons.length > 0)

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('lesson-search')?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Course Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg truncate">{outline.course.title}</h2>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {outline.course.description}
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="lesson-search"
            placeholder="Search lessons... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-auto">
        {filteredSections.map((section) => (
          <Collapsible
            key={section.id}
            open={!collapsedSections.has(section.id)}
            onOpenChange={() => toggleSection(section.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto font-medium"
              >
                {section.title}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-1 pb-2">
                {section.lessons.map((lesson) => {
                  const isActive = pathname === `/courses/${courseId}/lessons/${lesson.id}`
                  const LessonIcon = 
                    lesson.type === 'VIDEO' ? Play :
                    lesson.type === 'SCORM' ? Package :
                    lesson.type === 'INTERACTIVE' ? Gamepad2 :
                    FileText

                  return (
                    <div key={lesson.id} className="px-4">
                      {lesson.isLocked ? (
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          <LessonIcon className="h-4 w-4" />
                          <span className="truncate">{lesson.title}</span>
                        </div>
                      ) : (
                        <Link
                          href={`/courses/${courseId}/lessons/${lesson.id}`}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
                            isActive && "bg-accent text-accent-foreground"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {lesson.isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <LessonIcon className="h-4 w-4" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
