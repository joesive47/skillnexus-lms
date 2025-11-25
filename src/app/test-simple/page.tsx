export default function TestSimplePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          SkillNexus Test Page
        </h1>
        <p className="text-gray-600 mb-4">
          หากคุณเห็นหน้านี้แสดงว่า Next.js ทำงานได้ปกติ
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          กลับไปหน้าแรก
        </a>
      </div>
    </div>
  )
}