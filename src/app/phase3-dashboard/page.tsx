import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GamificationDashboard from '@/components/phase3/gamification/GamificationDashboard'
import AnalyticsDashboard from '@/components/phase3/analytics/AnalyticsDashboard'
import StudyGroups from '@/components/phase3/collaboration/StudyGroups'
import { Trophy, BarChart3, Users, Sparkles } from 'lucide-react'

export default async function Phase3Dashboard() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Phase 3: Advanced Learning Hub
              </h1>
              <p className="text-gray-600">
                Gamification • Analytics • Collaboration • Achievements
              </p>
            </div>
          </div>
          
          {/* Feature Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold">🎮 Gamification</h3>
                    <p className="text-sm text-gray-500">Levels, badges, leaderboards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">📊 Analytics</h3>
                    <p className="text-sm text-gray-500">Learning insights & trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">🤝 Collaboration</h3>
                    <p className="text-sm text-gray-500">Study groups & peer learning</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">🏆 Achievements</h3>
                    <p className="text-sm text-gray-500">Rewards & recognition</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="gamification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gamification" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Gamification
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Collaboration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gamification">
            <Suspense fallback={<div className="flex justify-center p-8">Loading gamification...</div>}>
              <GamificationDashboard />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics">
            <Suspense fallback={<div className="flex justify-center p-8">Loading analytics...</div>}>
              <AnalyticsDashboard />
            </Suspense>
          </TabsContent>

          <TabsContent value="collaboration">
            <Suspense fallback={<div className="flex justify-center p-8">Loading collaboration...</div>}>
              <StudyGroups />
            </Suspense>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">🎯 Daily Challenge</h3>
                <p className="text-sm text-yellow-700 mb-3">Complete 3 lessons to earn bonus XP</p>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-1/3"></div>
                </div>
                <p className="text-xs text-yellow-600 mt-1">1/3 completed</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">📚 Study Streak</h3>
                <p className="text-sm text-blue-700 mb-3">Keep your learning streak alive!</p>
                <div className="text-2xl font-bold text-blue-600">5 days</div>
                <p className="text-xs text-blue-600">Your current streak</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">👥 Active Groups</h3>
                <p className="text-sm text-green-700 mb-3">Join discussions in your study groups</p>
                <div className="text-2xl font-bold text-green-600">3</div>
                <p className="text-xs text-green-600">Groups with new messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}