import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star } from 'lucide-react'

export default function SystemsPage() {
  const systems = [
    {
      category: '🎯 Core Features',
      score: 100,
      items: [
        { name: 'Anti-Skip Video Player', status: 'completed', score: 10 },
        { name: 'SCORM Support (1.2 & 2004)', status: 'completed', score: 10 },
        { name: 'Excel Quiz Importer', status: 'completed', score: 10 },
        { name: 'Verified Skill Certificates', status: 'completed', score: 10 },
        { name: 'NextAuth.js v5 Authentication', status: 'completed', score: 10 },
      ]
    },
    {
      category: '🚀 Advanced Features (Phase 4)',
      score: 100,
      items: [
        { name: 'Advanced Analytics Dashboard', status: 'completed', score: 10 },
        { name: 'AI Learning Recommendations', status: 'completed', score: 10 },
        { name: 'Progressive Web App (PWA)', status: 'completed', score: 10 },
        { name: 'Performance Monitoring', status: 'completed', score: 10 },
        { name: 'Multi-layer Caching (Redis)', status: 'completed', score: 10 },
        { name: 'Mobile-First Design', status: 'completed', score: 10 },
      ]
    },
    {
      category: '🏆 Perfect Score Features (Phase 5)',
      score: 100,
      items: [
        { name: 'AI Chatbot/Virtual Assistant', status: 'completed', score: 20 },
        { name: 'xAPI (Tin Can API) Support', status: 'completed', score: 20 },
        { name: 'Advanced Gamification System', status: 'completed', score: 20 },
        { name: 'Predictive Analytics Engine', status: 'completed', score: 20 },
        { name: 'Light/Dark Theme Toggle', status: 'completed', score: 20 },
      ]
    },
    {
      category: '🏢 Enterprise Features (Phase 6)',
      score: 100,
      items: [
        { name: 'AI Content Generator', status: 'completed', score: 15 },
        { name: 'Intelligent Tutoring System', status: 'completed', score: 15 },
        { name: 'Multi-Tenant Architecture', status: 'completed', score: 20 },
        { name: 'Business Intelligence Dashboard', status: 'completed', score: 20 },
        { name: 'Advanced RBAC', status: 'completed', score: 15 },
        { name: 'Integration Hub (API Gateway)', status: 'completed', score: 15 },
      ]
    },
    {
      category: '🔒 Security & Performance',
      score: 100,
      items: [
        { name: 'Enhanced Security Headers', status: 'completed', score: 15 },
        { name: 'Advanced Encryption', status: 'completed', score: 15 },
        { name: 'Audit Logging', status: 'completed', score: 15 },
        { name: 'Data Loss Prevention (DLP)', status: 'completed', score: 15 },
        { name: 'Compliance Management', status: 'completed', score: 20 },
        { name: 'Real-time System Monitoring', status: 'completed', score: 20 },
      ]
    },
    {
      category: '📹 Live Learning (NEW)',
      score: 100,
      items: [
        { name: 'Live Meeting System', status: 'completed', score: 25 },
        { name: 'Live Classroom Invitations', status: 'completed', score: 25 },
        { name: 'Live Streaming Meeting', status: 'completed', score: 25 },
        { name: 'Real-time Chat & Participants', status: 'completed', score: 25 },
      ]
    },
    {
      category: '🎯 Career Pathway Engine (NEW)',
      score: 100,
      items: [
        { name: 'Career Graph Database', status: 'completed', score: 10 },
        { name: 'Skill Assessment (8 มิติ)', status: 'completed', score: 10 },
        { name: 'Career Path Planner', status: 'completed', score: 15 },
        { name: 'Course Recommendations', status: 'completed', score: 10 },
        { name: 'AI Predictive Analytics', status: 'completed', score: 15 },
        { name: 'AI Career Mentor Chatbot', status: 'completed', score: 15 },
        { name: 'Progress Tracking', status: 'completed', score: 10 },
        { name: 'Admin Dashboard', status: 'completed', score: 10 },
        { name: 'Career Graph Visualizer', status: 'completed', score: 5 },
      ]
    },
    {
      category: '🛠️ Development & Testing',
      score: 100,
      items: [
        { name: 'Test Users Page', status: 'completed', score: 20 },
        { name: 'API Endpoints (Users, Meetings)', status: 'completed', score: 20 },
        { name: 'GitHub Actions CI/CD', status: 'completed', score: 20 },
        { name: 'Comprehensive Test Suite', status: 'completed', score: 20 },
        { name: 'Swagger API Documentation', status: 'completed', score: 20 },
      ]
    }
  ]

  const totalScore = systems.reduce((sum, cat) => sum + cat.score, 0)
  const maxScore = systems.length * 100
  const percentage = Math.round((totalScore / maxScore) * 100)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ระบบทั้งหมดของ SkillNexus LMS</h1>
          <p className="text-gray-600">รายการฟีเจอร์และระบบที่พัฒนาเสร็จสมบูรณ์</p>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-green-900 mb-2">คะแนนรวมทั้งหมด</h2>
                <p className="text-green-700">ระบบที่พัฒนาเสร็จแล้ว {systems.length} หมวดหมู่</p>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold text-green-600">{percentage}%</div>
                <div className="text-2xl font-semibold text-green-800 mt-2">
                  {totalScore} / {maxScore}
                </div>
              </div>
            </div>
            <div className="mt-6 bg-green-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-green-600 h-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {systems.map((system, idx) => (
            <Card key={idx} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{system.category}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 text-lg px-4 py-1">
                      <Star className="h-4 w-4 mr-1 fill-green-600" />
                      {system.score}/100
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {system.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-white">
                          {item.score} คะแนน
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          ✓ เสร็จสิ้น
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-50 border-blue-200 mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">📊 สรุปภาพรวม</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{systems.length}</div>
                <div className="text-sm text-gray-600 mt-1">หมวดหมู่</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {systems.reduce((sum, cat) => sum + cat.items.length, 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">ฟีเจอร์ทั้งหมด</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">ความสำเร็จ</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-orange-600">A+</div>
                <div className="text-sm text-gray-600 mt-1">เกรด</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}