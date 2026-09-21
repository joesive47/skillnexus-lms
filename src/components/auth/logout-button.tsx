'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = async () => {
    // Clear all localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }
    
    // Sign out and redirect to login
    await signOut({ 
      callbackUrl: '/login',
      redirect: true 
    })
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className={cn('flex items-center gap-2', className)}
    >
      <LogOut className="w-4 h-4" />
      ออกจากระบบ
    </Button>
  )
}
