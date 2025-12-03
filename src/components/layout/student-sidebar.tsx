'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, Award, TrendingUp, Clock, Search, 
  MessageSquare, Users, Target, BarChart, Home
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
  { icon: MessageSquare, label: 'AI Assistant', href: '/dashboard/chatbot' },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
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
  );
}
