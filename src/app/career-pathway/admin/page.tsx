import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, Target, Award, BarChart3, Settings } from 'lucide-react'

export default async function AdminPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/career-pathway')
  }

  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    completedPaths: 456,
    avgSuccessRate: 78,
    totalAssessments: 2341,
    avgTimeToComplete: 14
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Badge className="mb-4 bg-red-100 text-red-800">
            <Settings className="h-3 w-3 mr-1" />
            Admin Dashboard
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Pathway Admin</h1>
          <p className="text-gray-600">จัดการและติดตามระบบ Career Pathway Engine</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Paths</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.completedPaths.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Success Rate</CardTitle>
              <Award className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.avgSuccessRate}%</div>
              <p className="text-xs text-green-600 mt-1">+3% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Assessments</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalAssessments.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+20% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Time (months)</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.avgTimeToComplete}</div>
              <p className="text-xs text-red-600 mt-1">-2 months from last quarter</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Popular Career Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { path: 'Junior Dev → Senior Dev', users: 342, growth: '+15%' },
                  { path: 'Data Analyst → Data Scientist', users: 289, growth: '+22%' },
                  { path: 'Marketing → Digital Marketing', users: 234, growth: '+18%' },
                  { path: 'Senior Dev → Tech Lead', users: 198, growth: '+12%' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.path}</p>
                      <p className="text-sm text-gray-600">{item.users} users</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{item.growth}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Top Skills in Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { skill: 'JavaScript', demand: 95, color: 'bg-blue-600' },
                  { skill: 'Python', demand: 92, color: 'bg-green-600' },
                  { skill: 'React', demand: 88, color: 'bg-purple-600' },
                  { skill: 'Machine Learning', demand: 85, color: 'bg-orange-600' },
                  { skill: 'AWS', demand: 82, color: 'bg-yellow-600' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.skill}</span>
                      <span className="text-sm font-bold text-gray-900">{item.demand}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.demand}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">System Health</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-blue-100">Uptime</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold">1.2s</div>
                <div className="text-sm text-blue-100">Avg Response</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold">85%</div>
                <div className="text-sm text-blue-100">AI Accuracy</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold">4.8/5</div>
                <div className="text-sm text-blue-100">User Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}