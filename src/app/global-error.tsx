'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              เกิดข้อผิดพลาดในระบบ
            </h2>
            <p className="text-gray-600 mb-4">
              ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
            </p>
            <details className="mb-4">
              <summary className="cursor-pointer text-sm font-medium">
                รายละเอียดข้อผิดพลาด
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
            <button
              onClick={reset}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}