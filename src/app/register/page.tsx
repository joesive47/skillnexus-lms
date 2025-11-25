import { RegisterForm } from "@/components/auth/register-form"
import { Suspense } from "react"

function RegisterFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">สมัครสมาชิก SkillNexus</h1>
        <div className="text-center text-gray-600">
          กำลังโหลดฟอร์มสมัครสมาชิก...
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense fallback={<RegisterFallback />}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}