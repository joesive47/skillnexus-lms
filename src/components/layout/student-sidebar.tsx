'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  BookOpen, Award, TrendingUp, Clock, Search, 
  MessageSquare, Users, Target, BarChart, Home, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/student/dashboard' },
  { icon: BookOpen, label: 'My Courses', href: '/courses' },
  { icon: Search, label: 'Browse Courses', href: '/courses' },
  { icon: Award, label: 'Certificates', href: '/dashboard/certificates' },
  { icon: Target, label: 'Learning Paths', href: '/learning-paths' },
  { icon: TrendingUp, label: 'Skills Assessment', href: '/skills-assessment' },
  { icon: BarChart, label: 'Progress', href: '/student/dashboard' },
  { icon: Clock, label: 'Study Time', href: '/student/dashboard' },
  { icon: Users, label: 'Study Groups', href: '/social-learning' },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300",
        "lg:translate-x-0", // Always visible on desktop
        isOpen ? "translate-x-0" : "-translate-x-full" // Toggle on mobile
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <h2 className="font-bold text-lg">Student Portal</h2>
              <p className="text-xs text-gray-500">SkillNexus LMS</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Close mobile menu on navigation
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
