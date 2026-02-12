"use client"

import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useState } from "react"
import { authenticate } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

// Helper function to log client-side errors
async function logClientError(email: string, step: string, message: string, data?: any) {
  try {
    await fetch('/api/debug/log-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, step, message, level: 'error', data })
    })
  } catch (error) {
    console.error('Failed to log client error:', error)
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
    </Button>
  )
}

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const registered = searchParams?.get('registered')

  // Log client-side errors
  useEffect(() => {
    if (errorMessage && email) {
      logClientError(email, 'FORM_ERROR', errorMessage, { 
        timestamp: new Date().toISOString() 
      })
    }
  }, [errorMessage, email])

  // Role-based redirect หลัง login สำเร็จ
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = session.user.role
      const redirectMap: Record<string, string> = {
        'ADMIN': '/admin/dashboard',
        'TEACHER': '/teacher/dashboard',
        'STUDENT': '/dashboard'
      }
      const redirectTo = redirectMap[role] || '/dashboard'
      
      // Log successful redirect
      if (email) {
        fetch('/api/debug/log-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            step: 'REDIRECT_SUCCESS', 
            message: `Redirecting to ${redirectTo}`,
            level: 'success',
            data: { role, redirectTo }
          })
        }).catch(console.error)
      }
      
      // ใช้ router.replace เพื่อไม่ให้กดปุ่ม back กลับมาหน้า login
      router.replace(redirectTo)
    }
  }, [status, session, router, email])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Image 
            src="/logoupPowerskill.png" 
            alt="upPowerSkill Logo" 
            width={64}
            height={64}
            clasvalue={email}
                onChange={(e) => setEmail(e.target.value)}
                sName="object-contain"
            priority
          />
        </div>
        <CardTitle className="text-center">เข้าสู่ระบบ upPowerSkill</CardTitle>
        <CardDescription className="text-center">
          กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
        </CardDescription>
        {registered && (
          <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
            สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่านของคุณ"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>bg-red-50 p-4 rounded-md space-y-2">
                <div className="flex items-start gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{errorMessage}</p>
                    <p className="text-xs mt-1 text-red-600">
                      รหัสข้อผิดพลาดถูกบันทึกไว้แล้ว สามารถแจ้งทีมสนับสนุนได้
                    </p>
                  </div>
                </div>
              <div className="text-sm text-destructive bg-red-50 p-3 rounded-md">
                {errorMessage}
              </div>
            )}
            <SubmitButton />
          </form>
        </div>
      </CardContent>
      
      <div className="p-6 pt-0">
        <p className="text-center text-sm text-muted-foreground">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </Card>
  )
}