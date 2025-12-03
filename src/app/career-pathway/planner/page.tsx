'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Clock, TrendingUp, DollarSign, Target } from 'lucide-react'
import { careerNodes } from '@/lib/career/career-data'
import { CareerGraphVisualizer } from '@/components/career/career-graph-visualizer'

export default function PlannerPage() {
  const [currentCareer, setCurrentCareer] = useState('')
  const [targetCareer, setTargetCareer] = useState('')
  const [path, setPath] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generatePath = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/career-pathway/find-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCareer, targetCareer })
      })
      const data = await response.json()
      if (data.success) {
        setPath(data.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Path Planner</h1>
          <p className="text-gray-600">วางแผนเส้นทางอาชีพของคุณด้วย AI</p>
        </div>

        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle>เลือกเส้นทางอาชีพ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  อาชีพปัจจุบัน
                </label>
                <select
                  value={currentCareer}
                  onChange={(e) => setCurrentCareer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">เลือกอาชีพปัจจุบัน</option>
                  {careerNodes.map(node => (
                    <option key={node.id} value={node.id}>{node.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  อาชีพเป้าหมาย
                </label>
                <select
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">เลือกอาชีพเป้าหมาย</option>
                  {careerNodes.map(node => (
                    <option key={node.id} value={node.id}>{node.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={generatePath}
              disabled={!currentCareer || !targetCareer || loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'กำลังวิเคราะห์...' : 'สร้างเส้นทางอาชีพ'}
              <Target className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {path && (
          <>
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">สรุปเส้นทางอาชีพ</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <Clock className="h-6 w-6 mb-2" />
                    <div className="text-2xl font-bold">{path.totalMonths}</div>
                    <div className="text-sm text-blue-100">เดือน</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <div className="text-2xl font-bold">{path.path.length}</div>
                    <div className="text-sm text-blue-100">ขั้นตอน</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <Target className="h-6 w-6 mb-2" />
                    <div className="text-2xl font-bold">{path.requiredSkills.length}</div>
                    <div className="text-sm text-blue-100">ทักษะ</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <DollarSign className="h-6 w-6 mb-2" />
                    <div className="text-2xl font-bold">{(path.estimatedSalary / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-blue-100">เงินเดือน</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg mb-8">
              <CardHeader>
                <CardTitle>แผนที่ Career Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <CareerGraphVisualizer highlightPath={path.path} />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg mb-8">
              <CardHeader>
                <CardTitle>เส้นทางอาชีพของคุณ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {path.path.map((careerId: string, index: number) => {
                    const career = careerNodes.find(n => n.id === careerId)
                    return (
                      <div key={careerId} className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900">{career?.title}</h4>
                          <p className="text-sm text-gray-600">Level {career?.level} • ฿{career?.salary.toLocaleString()}/เดือน</p>
                        </div>
                        {index < path.path.length - 1 && (
                          <ArrowRight className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>ทักษะที่ต้องพัฒนา</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {path.requiredSkills.map((skill: string) => (
                    <Badge key={skill} className="bg-purple-100 text-purple-800 px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}