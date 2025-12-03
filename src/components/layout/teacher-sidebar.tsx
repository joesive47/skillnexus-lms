'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, Users, FileText, BarChart, Home,
  Plus, GraduationCap, MessageSquare, Video
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/teacher/dashboard' },
  { icon: BookOpen, label: 'My Courses', href: '/dashboard/admin/courses' },
  { icon: Plus, label: 'Create Course', href: '/dashboard/teacher/create' },
  { icon: FileText, label: 'Quizzes', href: '/dashboard/admin/quizzes' },
  { icon: Users, label: 'Students', href: '/dashboard/admin/users' },
  { icon: GraduationCap, label: 'Gradebook', href: '/gradebook' },
  { icon: BarChart, label: 'Analytics', href: '/analytics' },
  { icon: Video, label: 'Live Sessions', href: '/dashboard/admin/live-sessions' },
  { icon: MessageSquare, label: 'Chatbot', href: '/dashboard/admin/chatbot' },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
            T
          </div>
          <div>
            <h2 className="font-bold text-lg">Teacher Portal</h2>
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
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-green-100 text-green-700 font-semibold'
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
  );
}
