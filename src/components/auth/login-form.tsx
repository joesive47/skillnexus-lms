"use client"

import { type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
    </Button>
  )
}

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string>()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchParams = useSearchParams()
  const registered = searchParams?.get('registered')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(undefined)

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!result?.ok || result.error) {
        setErrorMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        return
      }

      // Use a full navigation after Auth.js has written its cookie. The server-side
      // dashboard then chooses the role-specific destination from the fresh session.
      // This avoids a client session refresh race that made learners retry login.
      const redirectTo = '/dashboard'

      window.location.replace(redirectTo)
    } catch (error) {
      console.error('Login failed:', error)
      setErrorMessage('เกิดข้อผิดพลาดในการเข้าระบบ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Image 
            src="/logoupPowerskill.png" 
            alt="upPowerSkill Logo" 
            width={64}
            height={64}
            className="object-contain"
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
          
          <form 
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            </div>
            {errorMessage && (
              <div className="text-sm bg-red-50 p-4 rounded-md space-y-2">
                <div className="flex items-start gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{errorMessage}</p>
                    <p className="text-xs mt-1 text-red-600">
                      รหัสข้อผิดพลาดถูกบันทึกไว้แล้ว สามารถแจ้งทีมสนับสนุนได้
                    </p>
                  </div>
                </div>
              </div>
            )}
            <SubmitButton pending={isSubmitting} />
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
