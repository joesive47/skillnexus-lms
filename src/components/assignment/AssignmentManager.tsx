'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react'

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded'
  grade?: number
  maxGrade: number
  course: string
}

const sampleAssignments: Assignment[] = [
  {
    id: '1',
    title: 'React Hooks Project',
    description: 'Build a todo app using React Hooks',
    dueDate: '2025-02-01',
    status: 'pending',
    maxGrade: 100,
    course: 'React 18 Complete'
  },
  {
    id: '2',
    title: 'TypeScript Exercise',
    description: 'Complete TypeScript challenges',
    dueDate: '2025-01-25',
    status: 'submitted',
    maxGrade: 100,
    course: 'TypeScript Mastery'
  },
  {
    id: '3',
    title: 'Node.js API',
    description: 'Create REST API with Express',
    dueDate: '2025-01-20',
    status: 'graded',
    grade: 95,
    maxGrade: 100,
    course: 'Node.js Backend'
  }
]

export default function AssignmentManager() {
  const [assignments] = useState(sampleAssignments)
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all')

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />
      case 'submitted': return <Upload className="w-4 h-4 text-blue-600" />
      case 'graded': return <CheckCircle className="w-4 h-4 text-green-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-800',
      submitted: 'bg-blue-100 text-blue-800',
      graded: 'bg-green-100 text-green-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">📝 Assignments</h1>
        <p className="text-slate-700 font-medium">Manage your homework and projects</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-6">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' ? 'bg-slate-900' : 'border-slate-300 text-slate-700'}
        >
          All ({assignments.length})
        </Button>
        <Button
          onClick={() => setFilter('pending')}
          variant={filter === 'pending' ? 'default' : 'outline'}
          className={filter === 'pending' ? 'bg-orange-600' : 'border-slate-300 text-slate-700'}
        >
          Pending ({assignments.filter(a => a.status === 'pending').length})
        </Button>
        <Button
          onClick={() => setFilter('submitted')}
          variant={filter === 'submitted' ? 'default' : 'outline'}
          className={filter === 'submitted' ? 'bg-blue-600' : 'border-slate-300 text-slate-700'}
        >
          Submitted ({assignments.filter(a => a.status === 'submitted').length})
        </Button>
        <Button
          onClick={() => setFilter('graded')}
          variant={filter === 'graded' ? 'default' : 'outline'}
          className={filter === 'graded' ? 'bg-green-600' : 'border-slate-300 text-slate-700'}
        >
          Graded ({assignments.filter(a => a.status === 'graded').length})
        </Button>
      </div>

      {/* Assignments Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="bg-white shadow-lg border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <Badge className={`${getStatusBadge(assignment.status)} border-0 font-bold`}>
                  {assignment.status}
                </Badge>
              </div>
              <CardTitle className="text-slate-900 text-lg">{assignment.title}</CardTitle>
              <p className="text-sm text-slate-600 font-medium">{assignment.course}</p>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 text-sm mb-4">{assignment.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-700">
                  <Calendar className="w-4 h-4 mr-2 text-slate-600" />
                  <span className="font-medium">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>

                {assignment.status === 'graded' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-green-800">Grade:</span>
                      <span className="text-2xl font-extrabold text-green-700">
                        {assignment.grade}/{assignment.maxGrade}
                      </span>
                    </div>
                  </div>
                )}

                {assignment.status === 'pending' && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </Button>
                )}

                {assignment.status === 'submitted' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-sm font-bold text-blue-800">Waiting for grade...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No assignments found</h3>
          <p className="text-slate-600">No assignments match your filter</p>
        </div>
      )}
    </div>
  )
}