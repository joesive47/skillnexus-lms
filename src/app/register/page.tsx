import { RegisterForm } from "@/components/auth/register-form"
import { Suspense } from "react"
import { Lightbulb, Rocket } from "lucide-react"
import Link from "next/link"

function RegisterFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-2xl p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-200/50">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Rocket className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
          เริ่มต้นเรียนรู้
        </h1>
        <p className="text-center text-gray-600 mb-6">กำลังโหลด...</p>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations — hidden on small screens to save render */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="hidden sm:block absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float pointer-events-none" />
      <div className="hidden sm:block absolute bottom-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 flex flex-col items-center w-full px-4 py-8 sm:py-12">
        {/* Logo header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 sm:space-x-3 mb-4">
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
          <div className="inline-flex items-center rounded-full bg-green-100 text-green-800 border border-green-300 px-3 py-1 text-xs sm:text-sm font-medium">
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            สมัครฟรี! เริ่มเรียนได้ทันที
          </div>
        </div>

        {/* Form card */}
        <div className="w-full max-w-2xl">
          <Suspense fallback={<RegisterFallback />}>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-200/50 p-4 sm:p-6 lg:p-8">
              <RegisterForm />
            </div>
          </Suspense>

          <p className="text-center text-gray-600 text-sm mt-5 pb-6">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
