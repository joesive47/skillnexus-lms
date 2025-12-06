'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Award, Users, Download, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Course {
  id: string
  title: string
}

interface BadgeProgram {
  id: string
  name: string
  description: string | null
  icon?: string | null
  color?: string | null
  points: number
  _count: { userBadges: number }
}

export default function BadgeAdminPage() {
  const [badges, setBadges] = useState<BadgeProgram[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    points: 100
  })

  useEffect(() => {
    fetchBadges()
    fetchCourses()
  }, [])

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/badges/list')
      const data = await response.json()
      setBadges(data)
    } catch (error) {
      console.error('Failed to fetch badges:', error)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const handleCreateBadge = async () => {
    try {
      const response = await fetch('/api/badges/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsCreateOpen(false)
        setFormData({
          name: '',
          description: '',
          icon: '',
          color: '#3b82f6',
          points: 100
        })
        fetchBadges()
      }
    } catch (error) {
      console.error('Failed to create badge:', error)
    }
  }



  const exportBadges = () => {
    const dataStr = JSON.stringify(badges, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'badge-programs.json'
    link.click()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Badge Program Management</h1>
          <p className="text-muted-foreground">Create and manage certification paths</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportBadges}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Badge Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Badge Program</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Badge Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Input
                  placeholder="Icon (emoji or URL)"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    placeholder="Points"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  />
                </div>

                <Button onClick={handleCreateBadge} className="w-full">
                  Create Badge
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {badges.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">No badges created yet</p>
          </div>
        ) : (
          badges.map((badge) => (
            <Card key={badge.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {badge.icon ? (
                    <span className="text-2xl">{badge.icon}</span>
                  ) : (
                    <Award className="h-5 w-5" style={{ color: badge.color || '#3b82f6' }} />
                  )}
                  {badge.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{badge.description || 'No description'}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{badge._count.userBadges} earned</span>
                    </div>
                    <Badge variant="secondary">{badge.points} pts</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}