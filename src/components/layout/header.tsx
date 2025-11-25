'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { SearchBar } from '@/components/search/search-bar'
import { Button } from '@/components/ui/button'
import { User, LogOut, BookOpen, Home, Headphones, Link2, Building2, MessageSquare, Sparkles } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-lg border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              SkillNexus
            </span>
          </Link>

          {/* Phase 3 Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/phase3" className="flex items-center space-x-1 text-gray-300 hover:text-purple-300 transition-colors">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Phase 3</span>
            </Link>
            <Link href="/vr-learning" className="flex items-center space-x-1 text-gray-300 hover:text-purple-300 transition-colors">
              <Headphones className="w-4 h-4" />
              <span className="text-sm">VR/AR</span>
            </Link>
            <Link href="/blockchain" className="flex items-center space-x-1 text-gray-300 hover:text-blue-300 transition-colors">
              <Link2 className="w-4 h-4" />
              <span className="text-sm">Blockchain</span>
            </Link>
            <Link href="/enterprise" className="flex items-center space-x-1 text-gray-300 hover:text-green-300 transition-colors">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">Enterprise</span>
            </Link>
            <Link href="/social-learning" className="flex items-center space-x-1 text-gray-300 hover:text-orange-300 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Social</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>แดชบอร์ด</span>
                </Link>
                
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{session.user?.name || session.user?.email}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ออกจากระบบ</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}