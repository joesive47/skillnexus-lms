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
  title: string
  description: string
  logoUrl?: string
  autoIssue: boolean
  requirements: Array<{
    courseId: string
    minScore: number
    course: Course
  }>
  _count: { userBadges: number }
}

export default function BadgeAdminPage() {
  const [badges, setBadges] = useState<BadgeProgram[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    logoUrl: '',
    autoIssue: true,
    requirements: [{ courseId: '', minScore: 60 }]
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
          title: '',
          description: '',
          logoUrl: '',
          autoIssue: true,
          requirements: [{ courseId: '', minScore: 60 }]
        })
        fetchBadges()
      }
    } catch (error) {
      console.error('Failed to create badge:', error)
    }
  }

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, { courseId: '', minScore: 60 }]
    })
  }

  const updateRequirement = (index: number, field: string, value: any) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = { ...newRequirements[index], [field]: value }
    setFormData({ ...formData, requirements: newRequirements })
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
                  placeholder="Badge Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Input
                  placeholder="Logo URL (optional)"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Course Requirements</h3>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <Select
                        value={req.courseId}
                        onValueChange={(value) => updateRequirement(index, 'courseId', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Min Score"
                        value={req.minScore}
                        onChange={(e) => updateRequirement(index, 'minScore', parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  ))}
                  <Button variant="outline" onClick={addRequirement}>
                    Add Course Requirement
                  </Button>
                </div>

                <Button onClick={handleCreateBadge} className="w-full">
                  Create Badge Program
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => (
          <Card key={badge.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {badge.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{badge._count.userBadges} earned</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Requirements:</p>
                  {badge.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span>{req.course.title}</span>
                      <Badge variant="secondary">{req.minScore}% min</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}