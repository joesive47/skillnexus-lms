'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  credits: number
}

interface CreditManagerProps {
  users: User[]
  onCreditsUpdated: () => void
}

export default function CreditManager({ users, onCreditsUpdated }: CreditManagerProps) {
  const [selectedUser, setSelectedUser] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddCredits = async () => {
    if (!selectedUser || !amount) {
      toast.error('Please select user and enter amount')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          amount: parseInt(amount),
          description
        })
      })

      if (response.ok) {
        toast.success('Credits added successfully')
        setAmount('')
        setDescription('')
        onCreditsUpdated()
      } else {
        toast.error('Failed to add credits')
      }
    } catch (error) {
      toast.error('Error adding credits')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>จัดการเครดิต</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">เลือกนักเรียน</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">เลือกนักเรียน</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email}) - {user.credits} เครดิต
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">จำนวนเครดิต</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="จำนวนเครดิตที่จะเพิ่ม"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">หมายเหตุ</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="หมายเหตุ (ไม่บังคับ)"
          />
        </div>

        <Button onClick={handleAddCredits} disabled={loading} className="w-full">
          {loading ? 'กำลังเพิ่มเครดิต...' : 'เพิ่มเครดิต'}
        </Button>
      </CardContent>
    </Card>
  )
}