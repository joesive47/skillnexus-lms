'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  email: string
  password: string
  name: string | null
  role: string
  createdAt: string
}

export default function TestPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/test-users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">กำลังโหลด...</div>
      </div>
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'TEACHER': return 'bg-blue-100 text-blue-800'
      case 'STUDENT': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ทดสอบข้อมูล Users</h1>
          <p className="text-gray-600 mb-4">แสดงข้อมูล user, password, role ทั้งหมดในระบบ</p>
          <div className="flex gap-4">
            <a 
              href="/api/users" 
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              API: /api/users (ไม่มี password)
            </a>
            <a 
              href="/api/test-users" 
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              API: /api/test-users (มี password hash)
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {user.name || 'ไม่ระบุชื่อ'}
                  </CardTitle>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Password (Hashed)</label>
                    <p className="text-gray-900 font-mono text-xs bg-gray-50 p-2 rounded break-all">
                      {user.password}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">สร้างเมื่อ</label>
                    <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">
                      {new Date(user.createdAt).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="text-center py-8">
              <p className="text-gray-500">ไม่พบข้อมูล users ในระบบ</p>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            รวมทั้งหมด {users.length} users
          </p>
        </div>
      </div>
    </div>
  )
}