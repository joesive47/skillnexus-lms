import { LoginForm } from "@/components/auth/login-form"
import { Suspense } from "react"
import { Lightbulb, Sparkles } from "lucide-react"
import Link from "next/link"

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-200/50">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
          SkillNexus LMS
        </h1>
        <p className="text-center text-gray-600 mb-6">กำลังโหลด...</p>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
                SkillNexus
              </h1>
              <p className="text-xs text-gray-500">Global Learning Platform</p>
            </div>
          </Link>
          <div className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-1" />
            เข้าสู่ระบบเพื่อเริ่มเรียนรู้
          </div>
        </div>
        
        <Suspense fallback={<LoginFallback />}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-200/50 p-8">
            <LoginForm />
          </div>
        </Suspense>
        
        <p className="text-center text-gray-600 text-sm mt-6">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            สมัครสมาชิกฟรี
          </Link>
        </p>
      </div>
    </div>
  )
}