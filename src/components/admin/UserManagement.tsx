"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit, Plus, Search } from "lucide-react"
import { deleteUser, updateUserCredits } from "@/app/actions/user-actions"

interface User {
  id: string
  email: string
  name: string | null
  role: string
  credits: number
  createdAt: Date
  _count: {
    enrollments: number
    certificates: number
  }
}

interface UserManagementProps {
  users: User[]
}

export default function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCredits, setEditingCredits] = useState<string | null>(null)
  const [newCredits, setNewCredits] = useState("")

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteUser = async (userId: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?")) {
      try {
        await deleteUser(userId)
        setUsers(users.filter(user => user.id !== userId))
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการลบผู้ใช้")
      }
    }
  }

  const handleUpdateCredits = async (userId: string) => {
    try {
      const credits = parseInt(newCredits)
      if (isNaN(credits)) return
      
      await updateUserCredits(userId, credits)
      setUsers(users.map(user => 
        user.id === userId ? { ...user, credits } : user
      ))
      setEditingCredits(null)
      setNewCredits("")
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอัพเดทเครดิต")
    }
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: "destructive",
      STUDENT: "default"
    } as const
    
    return (
      <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
        {role === "ADMIN" ? "ผู้ดูแลระบบ" : "นักเรียน"}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ค้นหาผู้ใช้..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มผู้ใช้
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ผู้ดูแลระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "ADMIN").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">นักเรียน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "STUDENT").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการผู้ใช้</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีข้อมูลผู้ใช้
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">อีเมล</th>
                    <th className="text-left py-3 px-4">ชื่อ</th>
                    <th className="text-left py-3 px-4">บทบาท</th>
                    <th className="text-left py-3 px-4">เครดิต</th>
                    <th className="text-left py-3 px-4">หลักสูตร</th>
                    <th className="text-left py-3 px-4">ใบประกาศ</th>
                    <th className="text-left py-3 px-4">วันที่สมัคร</th>
                    <th className="text-left py-3 px-4">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.name || "-"}</td>
                      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-4">
                        {editingCredits === user.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={newCredits}
                              onChange={(e) => setNewCredits(e.target.value)}
                              className="w-20"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateCredits(user.id)}
                            >
                              บันทึก
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCredits(null)
                                setNewCredits("")
                              }}
                            >
                              ยกเลิก
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>{user.credits}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCredits(user.id)
                                setNewCredits(user.credits.toString())
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">{user._count.enrollments}</td>
                      <td className="py-3 px-4">{user._count.certificates}</td>
                      <td className="py-3 px-4">
                        {new Date(user.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === "ADMIN"}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}