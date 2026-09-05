'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BookOpen, Award, TrendingUp, Search,
  Users, Target, Home, Menu, X, GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home,       label: 'Dashboard',        href: '/student/dashboard' },
  { icon: BookOpen,   label: 'หลักสูตรของฉัน',   href: '/student/courses' },
  { icon: Search,     label: 'ค้นหาหลักสูตร',    href: '/courses' },
  { icon: Award,      label: 'ใบรับรอง',         href: '/dashboard/certificates' },
  { icon: Target,     label: 'เส้นทางการเรียน',  href: '/learning-paths' },
  { icon: TrendingUp, label: 'ประเมินทักษะ',      href: '/skills-assessment' },
  { icon: Users,      label: 'กลุ่มเรียน',        href: '/social-learning' },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
        <Link href="/student/dashboard" className="flex items-center gap-2" onClick={close}>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-bold text-gray-900">Student Portal</span>
        </Link>
        <button
          onClick={() => setIsOpen(o => !o)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 overflow-y-auto bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out',
          // Desktop: always visible; Mobile: slide in/out
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 truncate">Student Portal</h2>
            <p className="text-xs text-gray-500">upPowerSkill LMS</p>
          </div>
          {/* Close on mobile */}
          <button onClick={close} className="ml-auto lg:hidden text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-blue-600' : 'text-gray-400')} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
