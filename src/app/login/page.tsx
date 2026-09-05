import { LoginForm } from "@/components/auth/login-form"
import { Suspense } from "react"
import { Lightbulb, Sparkles } from "lucide-react"
import Link from "next/link"

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-200/50">
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
          upPowerSkill
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">กำลังโหลด...</p>
        <div className="animate-pulse space-y-3 sm:space-y-4">
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 relative overflow-hidden px-4 py-8">
      {/* Background blobs — hidden on xs for performance */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="hidden sm:block absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float pointer-events-none" />
      <div className="hidden sm:block absolute bottom-10 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
                upPowerSkill
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Learning Platform</p>
            </div>
          </Link>
          <div className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 text-xs sm:text-sm font-medium">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            เข้าสู่ระบบเพื่อเริ่มเรียนรู้
          </div>
        </div>

        {/* Form */}
        <Suspense fallback={<LoginFallback />}>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-200/50 p-5 sm:p-8">
            <LoginForm />
          </div>
        </Suspense>

        <p className="text-center text-gray-600 text-sm mt-5 pb-4">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            สมัครสมาชิกฟรี
          </Link>
        </p>
      </div>
    </div>
  )
}
