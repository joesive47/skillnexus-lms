'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  Crown,
  Zap,
  Globe,
  Lock,
  UserCheck,
  Database,
  Cloud
} from 'lucide-react'

export default function EnterpriseFeatures() {
  const [activeOrg, setActiveOrg] = useState('acme-corp')

  const organizations = [
    {
      id: 'acme-corp',
      name: 'ACME Corporation',
      users: 2500,
      courses: 150,
      departments: 12,
      plan: 'Enterprise Pro'
    },
    {
      id: 'tech-startup',
      name: 'Tech Startup Ltd.',
      users: 450,
      courses: 75,
      departments: 5,
      plan: 'Business'
    }
  ]

  const enterpriseFeatures = [
    {
      title: 'Multi-Tenant Architecture',
      description: 'แยกข้อมูลองค์กรอย่างปลอดภัย',
      icon: Building2,
      status: 'active'
    },
    {
      title: 'Advanced User Management',
      description: 'จัดการผู้ใช้และสิทธิ์แบบละเอียด',
      icon: UserCheck,
      status: 'active'
    },
    {
      title: 'Enterprise SSO',
      description: 'เชื่อมต่อกับระบบ Identity Provider',
      icon: Shield,
      status: 'active'
    },
    {
      title: 'Custom Branding',
      description: 'ปรับแต่งธีมและโลโก้ตามองค์กร',
      icon: Crown,
      status: 'active'
    },
    {
      title: 'Advanced Analytics',
      description: 'รายงานและวิเคราะห์ระดับองค์กร',
      icon: BarChart3,
      status: 'active'
    },
    {
      title: 'API Integration',
      description: 'เชื่อมต่อกับระบบ HR และ ERP',
      icon: Zap,
      status: 'active'
    }
  ]

  const departments = [
    { name: 'Engineering', users: 850, courses: 45, completion: 78 },
    { name: 'Sales', users: 320, courses: 25, completion: 92 },
    { name: 'Marketing', users: 180, courses: 30, completion: 85 },
    { name: 'HR', users: 45, courses: 20, completion: 95 },
    { name: 'Finance', users: 65, courses: 15, completion: 88 }
  ]

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Building2 className="w-8 h-8 mr-3 text-blue-400" />
            Enterprise Dashboard
          </h1>
          <p className="text-gray-400 mt-1">จัดการการเรียนรู้ระดับองค์กร</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={activeOrg}
            onChange={(e) => setActiveOrg(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          <Badge className="bg-purple-600">
            <Crown className="w-3 h-3 mr-1" />
            Enterprise
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">2,500</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Courses</p>
                <p className="text-2xl font-bold text-white">150</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Departments</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-white">84%</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="features">Enterprise Features</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="security">Security & Compliance</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enterpriseFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">{feature.title}</h3>
                          <Badge className="bg-green-600 text-xs">Active</Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{dept.name}</h4>
                        <p className="text-gray-400 text-sm">{dept.users} users • {dept.courses} courses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{dept.completion}%</div>
                      <div className="text-gray-400 text-sm">Completion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-white">Two-Factor Authentication</span>
                  <Badge className="bg-green-600">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-white">Data Encryption</span>
                  <Badge className="bg-green-600">AES-256</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-white">Audit Logging</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-white">GDPR Compliance</span>
                  <Badge className="bg-green-600">Compliant</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-yellow-400" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Role-Based Access</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Admin</Badge>
                    <Badge variant="outline">Manager</Badge>
                    <Badge variant="outline">Instructor</Badge>
                    <Badge variant="outline">Student</Badge>
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <h4 className="text-white font-medium mb-2">IP Restrictions</h4>
                  <p className="text-gray-400 text-sm">Office networks only</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Database className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">HR Systems</h3>
                <p className="text-gray-400 text-sm mb-4">เชื่อมต่อกับ Workday, BambooHR</p>
                <Button size="sm" className="bg-blue-600">Connected</Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Cloud className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Cloud Storage</h3>
                <p className="text-gray-400 text-sm mb-4">AWS S3, Google Drive</p>
                <Button size="sm" className="bg-green-600">Active</Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">SSO Providers</h3>
                <p className="text-gray-400 text-sm mb-4">Azure AD, Okta, Auth0</p>
                <Button size="sm" className="bg-purple-600">Configured</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}