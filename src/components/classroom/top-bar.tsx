import { MobileMenuToggle } from './mobile-menu-toggle'

interface TopBarProps {
  course: {
    id: string
    title: string
    description: string
  }
  courseId: string
}

export function TopBar({ course }: TopBarProps) {
  return (
    <header className="lg:hidden border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold truncate">{course.title}</h1>
        <MobileMenuToggle />
      </div>
    </header>
  )
}