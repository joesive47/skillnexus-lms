"use client"

import { useFormStatus } from "react-dom"
import { useFormState } from "react-dom"
import { authenticate } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
    </Button>
  )
}

export function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('callbackUrl') || searchParams?.get('redirect') || '/dashboard'
  const registered = searchParams?.get('registered')

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
          
          <form action={dispatch} className="space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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