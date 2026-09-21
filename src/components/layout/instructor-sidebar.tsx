'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BookOpen, Plus, Home, Menu, X, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: Home,      label: 'Dashboard',         href: '/instructor/dashboard' },
  { icon: BookOpen,  label: 'หลักสูตรของฉัน',    href: '/instructor/dashboard#my-courses' },
  { icon: Plus,      label: 'สร้างหลักสูตรใหม่', href: '/instructor/courses/new' },
]

export function InstructorSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
        <Link href="/instructor/dashboard" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-bold text-gray-900">Instructor Portal</span>
        </Link>
        <button onClick={() => setIsOpen(o => !o)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Toggle menu">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-40 h-full w-64 overflow-y-auto bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 truncate">Instructor Portal</h2>
            <p className="text-xs text-gray-500">upPowerSkill LMS</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="ml-auto lg:hidden text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="p-3 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href + item.label} href={item.href} onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}>
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-purple-600' : 'text-gray-400')} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Quick action */}
        <div className="p-3 mt-2 border-t border-gray-100">
          <Link href="/instructor/courses/new"
            className="flex items-center gap-2 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4 shrink-0" />
            สร้างหลักสูตรใหม่
          </Link>
        </div>
      </aside>
    </>
  )
}
