'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'

interface Classroom {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  course: {
    id: string
    title: string
    description?: string
  }
}

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('/api/classrooms')
      const data = await response.json()
      setClassrooms(data)
    } catch (error) {
      console.error('Failed to fetch classrooms:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Classrooms</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Classroom
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{classroom.name}</CardTitle>
                <Badge variant={classroom.isActive ? 'default' : 'secondary'}>
                  {classroom.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {classroom.course.title}
                </div>
                {classroom.description && (
                  <p className="text-sm text-muted-foreground">
                    {classroom.description}
                  </p>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Created {new Date(classroom.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/dashboard/classrooms/${classroom.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {classrooms.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No classrooms yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first classroom to start organizing course content
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Classroom
          </Button>
        </div>
      )}
    </div>
  )
}