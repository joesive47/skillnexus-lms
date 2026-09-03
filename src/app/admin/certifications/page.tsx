'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Upload, Plus, Edit, Trash2, Eye, Award, Shield } from 'lucide-react'

interface Course {
  id: string
  title: string
  published: boolean
}

interface CertificateDefinition {
  id: string
  courseId: string
  course: { title: string }
  templateHtml: string
  issuerName: string
  issuerTitle: string
  expiryMonths: number | null
  isActive: boolean
}

interface BadgeDefinition {
  id: string
  courseId: string
  course: { title: string }
  name: string
  description: string
  assetId: string | null
  asset: { url: string } | null
  isActive: boolean
}

export default function AdminCertificationPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [certificateDefs, setCertificateDefs] = useState<CertificateDefinition[]>([])
  const [badgeDefs, setBadgeDefs] = useState<BadgeDefinition[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [coursesRes, certsRes, badgesRes] = await Promise.all([
        fetch('/api/admin/courses'),
        fetch('/api/admin/certificate-definitions'),
        fetch('/api/admin/badge-definitions')
      ])

      setCourses(await coursesRes.json())
      setCertificateDefs(await certsRes.json())
      setBadgeDefs(await badgesRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Certification & Badge Management</h1>
        <div className="flex gap-2">
          <CreateCertificateDialog courses={courses} onSuccess={fetchData} />
          <CreateBadgeDialog courses={courses} onSuccess={fetchData} />
        </div>
      </div>

      <Tabs defaultValue="certificates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Course Certificates
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Course Badges
          </TabsTrigger>
          <TabsTrigger value="career-paths">Career Paths</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates">
          <CertificateDefinitionsTable 
            definitions={certificateDefs}
            courses={courses}
            onUpdate={fetchData}
          />
        </TabsContent>

        <TabsContent value="badges">
          <BadgeDefinitionsTable 
            definitions={badgeDefs}
            courses={courses}
            onUpdate={fetchData}
          />
        </TabsContent>

        <TabsContent value="career-paths">
          <CareerPathsManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <CertificationAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CreateCertificateDialog({ courses, onSuccess }: { courses: Course[], onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    courseId: '',
    templateHtml: '',
    issuerName: 'SkillNexus LMS',
    issuerTitle: 'Learning Management System',
    expiryMonths: '',
    criteria: [{ type: 'COMPLETION_PERCENTAGE', value: '80' }]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/certificate-definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setOpen(false)
        onSuccess()
        setFormData({
          courseId: '',
          templateHtml: '',
          issuerName: 'SkillNexus LMS',
          issuerTitle: 'Learning Management System',
          expiryMonths: '',
          criteria: [{ type: 'COMPLETION_PERCENTAGE', value: '80' }]
        })
      }
    } catch (error) {
      console.error('Error creating certificate definition:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Course Certificate Definition</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="courseId">Course</Label>
            <Select value={formData.courseId} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, courseId: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="issuerName">Issuer Name</Label>
            <Input
              id="issuerName"
              value={formData.issuerName}
              onChange={(e) => setFormData(prev => ({ ...prev, issuerName: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="issuerTitle">Issuer Title</Label>
            <Input
              id="issuerTitle"
              value={formData.issuerTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, issuerTitle: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="expiryMonths">Expiry (months, leave empty for no expiry)</Label>
            <Input
              id="expiryMonths"
              type="number"
              value={formData.expiryMonths}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryMonths: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="templateHtml">Certificate Template (HTML)</Label>
            <Textarea
              id="templateHtml"
              rows={6}
              value={formData.templateHtml}
              onChange={(e) => setFormData(prev => ({ ...prev, templateHtml: e.target.value }))}
              placeholder="HTML template for certificate..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Certificate</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CreateBadgeDialog({ courses, onSuccess }: { courses: Course[], onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    description: '',
    assetId: null as string | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/badge-definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setOpen(false)
        onSuccess()
        setFormData({ courseId: '', name: '', description: '', assetId: null })
      }
    } catch (error) {
      console.error('Error creating badge definition:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Shield className="w-4 h-4 mr-2" />
          Create Badge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Course Badge Definition</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="courseId">Course</Label>
            <Select value={formData.courseId} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, courseId: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Badge Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label>Badge Asset</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <Button type="button" variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Badge Builder
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Badge</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CertificateDefinitionsTable({ 
  definitions, 
  courses, 
  onUpdate 
}: { 
  definitions: CertificateDefinition[]
  courses: Course[]
  onUpdate: () => void 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Certificate Definitions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {definitions.map(def => (
            <div key={def.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{def.course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Issued by: {def.issuerName}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={def.isActive ? "default" : "secondary"}>
                    {def.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {def.expiryMonths && (
                    <Badge variant="outline">
                      Expires in {def.expiryMonths} months
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function BadgeDefinitionsTable({ 
  definitions, 
  courses, 
  onUpdate 
}: { 
  definitions: BadgeDefinition[]
  courses: Course[]
  onUpdate: () => void 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Badge Definitions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {definitions.map(def => (
            <div key={def.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                {def.asset?.url ? (
                  <img src={def.asset.url} alt={def.name} className="w-12 h-12 rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{def.name}</h3>
                  <p className="text-sm text-muted-foreground">{def.course.title}</p>
                </div>
              </div>
              <p className="text-sm mb-3">{def.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant={def.isActive ? "default" : "secondary"}>
                  {def.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CareerPathsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Paths Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Career paths management coming soon...</p>
      </CardContent>
    </Card>
  )
}

function CertificationAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
      </CardContent>
    </Card>
  )
}