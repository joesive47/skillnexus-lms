'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, Loader2, CheckCircle } from 'lucide-react'

export default function GenerateBARDCertificatePage() {
  const [users, setUsers] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d.users || []))
    fetch('/api/courses').then(r => r.json()).then(d => setCourses(d.courses || []))
  }, [])

  const handleGenerate = async () => {
    if (!selectedUser || !selectedCourse) return
    
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/bard-certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser, courseId: selectedCourse })
      })

      const data = await res.json()
      if (res.ok) {
        setResult(data.certificate)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">สร้างใบรับรอง BARD</h1>

      <Card>
        <CardHeader>
          <CardTitle>เลือกผู้ใช้และคอร์ส</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">ผู้ใช้</label>
            <select 
              className="w-full border rounded-md p-2"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">เลือกผู้ใช้</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">คอร์ส</label>
            <select 
              className="w-full border rounded-md p-2"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">เลือกคอร์ส</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!selectedUser || !selectedCourse || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <Award className="w-4 h-4 mr-2" />
                สร้างใบรับรอง BARD
              </>
            )}
          </Button>

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-900">สร้างสำเร็จ!</p>
              </div>
              <p className="text-sm">เลขที่: {result.certificateNumber}</p>
              <Button className="mt-3" asChild>
                <a href={`/bard-verify/${result.verificationToken}`} target="_blank">
                  ดูใบรับรอง
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
