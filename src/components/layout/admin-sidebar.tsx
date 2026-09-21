'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Users, BookOpen, Award, Settings, BarChart, 
  MessageSquare, FileText, CreditCard, Folder,
  GraduationCap, Mic, Package, Brain, Menu, X, Tags, Activity, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/components/auth/logout-button';

const menuItems = [
  { icon: BarChart, label: 'Dashboard', href: '/dashboard/admin' },
  { icon: Users, label: 'Users', href: '/dashboard/admin/users' },
  { icon: BookOpen, label: 'Courses', href: '/dashboard/admin/courses' },
  { icon: Tags, label: 'Course Categories', href: '/dashboard/admin/course-categories' },
  { icon: Activity, label: 'Course Analytics', href: '/admin/course-analytics' },
  { icon: TrendingUp, label: 'Learning Intelligence', href: '/dashboard/admin/analytics' },
  { icon: Users, label: 'Learner Care', href: '/admin/dashboard' },
  { icon: FileText, label: 'Quizzes', href: '/dashboard/admin/quizzes' },
  { icon: Package, label: 'SCORM', href: '/dashboard/admin/scorm' },
  { icon: Award, label: 'Certifications', href: '/admin/certifications' },
  { icon: GraduationCap, label: 'Badges', href: '/dashboard/admin/badges' },
  { icon: MessageSquare, label: 'Chatbot', href: '/dashboard/admin/chatbot' },
  { icon: Brain, label: 'AI Learning', href: '/ai-learning' },
  { icon: Mic, label: 'Voice Assignments', href: '/dashboard/admin/voice-assignments' },
  { icon: CreditCard, label: 'Payments', href: '/dashboard/admin/payments' },
  { icon: Folder, label: 'Files', href: '/dashboard/admin/files' },
  { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
];

export function AdminSidebar() {
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
        "fixed top-0 left-0 flex h-full w-64 flex-col overflow-hidden bg-white border-r border-gray-200 z-40 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-gray-500">upPowerSkill LMS</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-purple-100 text-purple-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <LogoutButton className="w-full justify-start px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700" />
          </div>
        </div>
      </aside>
    </>
  );
}
