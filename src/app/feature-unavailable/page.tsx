import Link from 'next/link'

export default function FeatureUnavailablePage() {
  return <main className="mx-auto max-w-xl p-10 space-y-4">
    <h1 className="text-2xl font-semibold">ฟีเจอร์นี้ยังไม่พร้อมใช้งาน</h1>
    <p>ปิดไว้ชั่วคราวระหว่างปรับปรุงการทำงานและความปลอดภัย ข้อมูลจำลองไม่ถูกนำมาแสดงเป็นผลการทำงานจริง</p>
    <Link className="underline" href="/dashboard">กลับหน้าหลัก</Link>
  </main>
}
