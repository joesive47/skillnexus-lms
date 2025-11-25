'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Award,
  Target,
  Activity,
  Eye,
  Play,
  Download
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalStudents: number
    activeCourses: number
    completionRate: number
    avgStudyTime: number
    totalCertificates: number
    engagement: number
  }
  trends: {
    date: string
    students: number
    completions: number
    engagement: number
  }[]
  coursePerformance: {
    name: string
    enrolled: number
    completed: number
    rating: number
    revenue: number
  }[]
  learningPatterns: {
    hour: number
    activity: number
  }[]
  demographics: {
    name: string
    value: number
    color: string
  }[]
}

export default function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        overview: {
          totalStudents: 12547,
          activeCourses: 89,
          completionRate: 87.5,
          avgStudyTime: 4.2,
          totalCertificates: 8934,
          engagement: 92.3
        },
        trends: [
          { date: '2024-01-01', students: 1200, completions: 89, engagement: 85 },
          { date: '2024-01-02', students: 1350, completions: 95, engagement: 88 },
          { date: '2024-01-03', students: 1180, completions: 78, engagement: 82 },
          { date: '2024-01-04', students: 1420, completions: 102, engagement: 91 },
          { date: '2024-01-05', students: 1580, completions: 115, engagement: 94 },
          { date: '2024-01-06', students: 1650, completions: 128, engagement: 96 },
          { date: '2024-01-07', students: 1720, completions: 134, engagement: 98 }
        ],
        coursePerformance: [
          { name: 'JavaScript Fundamentals', enrolled: 2340, completed: 2105, rating: 4.8, revenue: 234000 },
          { name: 'React Development', enrolled: 1890, completed: 1654, rating: 4.7, revenue: 189000 },
          { name: 'Node.js Backend', enrolled: 1560, completed: 1248, rating: 4.6, revenue: 156000 },
          { name: 'Python Data Science', enrolled: 2100, completed: 1890, rating: 4.9, revenue: 210000 },
          { name: 'UI/UX Design', enrolled: 1780, completed: 1424, rating: 4.5, revenue: 178000 }
        ],
        learningPatterns: [
          { hour: 0, activity: 12 }, { hour: 1, activity: 8 }, { hour: 2, activity: 5 },
          { hour: 3, activity: 3 }, { hour: 4, activity: 2 }, { hour: 5, activity: 4 },
          { hour: 6, activity: 15 }, { hour: 7, activity: 35 }, { hour: 8, activity: 65 },
          { hour: 9, activity: 85 }, { hour: 10, activity: 95 }, { hour: 11, activity: 88 },
          { hour: 12, activity: 75 }, { hour: 13, activity: 82 }, { hour: 14, activity: 90 },
          { hour: 15, activity: 78 }, { hour: 16, activity: 68 }, { hour: 17, activity: 58 },
          { hour: 18, activity: 72 }, { hour: 19, activity: 85 }, { hour: 20, activity: 92 },
          { hour: 21, activity: 78 }, { hour: 22, activity: 45 }, { hour: 23, activity: 25 }
        ],
        demographics: [
          { name: 'นักเรียน', value: 65, color: '#8884d8' },
          { name: 'ผู้ทำงาน', value: 25, color: '#82ca9d' },
          { name: 'ฟรีแลนซ์', value: 10, color: '#ffc658' }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [timeRange])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {change}
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">ข้อมูลเชิงลึกและการวิเคราะห์ประสิทธิภาพ</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="7d">7 วันที่ผ่านมา</option>
            <option value="30d">30 วันที่ผ่านมา</option>
            <option value="90d">90 วันที่ผ่านมา</option>
          </select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="นักเรียนทั้งหมด"
          value={data.overview.totalStudents.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="คอร์สที่เปิดสอน"
          value={data.overview.activeCourses}
          change="+3"
          trend="up"
          icon={BookOpen}
        />
        <MetricCard
          title="อัตราการจบคอร์ส"
          value={`${data.overview.completionRate}%`}
          change="+2.1%"
          trend="up"
          icon={Target}
        />
        <MetricCard
          title="เวลาเรียนเฉลี่ย"
          value={`${data.overview.avgStudyTime}h`}
          change="+0.3h"
          trend="up"
          icon={Clock}
        />
        <MetricCard
          title="ใบรับรองที่ออก"
          value={data.overview.totalCertificates.toLocaleString()}
          change="+156"
          trend="up"
          icon={Award}
        />
        <MetricCard
          title="ระดับการมีส่วนร่วม"
          value={`${data.overview.engagement}%`}
          change="+1.8%"
          trend="up"
          icon={Activity}
        />
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="trends" className="data-[state=active]:bg-purple-600">แนวโน้ม</TabsTrigger>
          <TabsTrigger value="courses" className="data-[state=active]:bg-purple-600">ประสิทธิภาพคอร์ส</TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-purple-600">รูปแบบการเรียน</TabsTrigger>
          <TabsTrigger value="demographics" className="data-[state=active]:bg-purple-600">ข้อมูลผู้ใช้</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">จำนวนนักเรียนใหม่</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Area type="monotone" dataKey="students" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">การจบคอร์ส</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">ประสิทธิภาพคอร์สเรียน</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.coursePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="enrolled" fill="#8B5CF6" />
                  <Bar dataKey="completed" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">รูปแบบการเรียนตามเวลา</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.learningPatterns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Area type="monotone" dataKey="activity" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">ประเภทผู้ใช้</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.demographics}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {data.demographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">สถิติรายละเอียด</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.demographics.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-300">{item.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-gray-700">
                      {item.value}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}