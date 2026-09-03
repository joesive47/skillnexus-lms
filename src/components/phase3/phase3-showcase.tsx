'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Headphones, 
  Link2, 
  Building2, 
  MessageSquare,
  Play,
  Eye,
  Shield,
  Users,
  Zap,
  Globe,
  Sparkles,
  ArrowRight
} from "lucide-react"

export function Phase3Showcase() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const features = [
    {
      id: 'vr',
      title: 'VR/AR Learning',
      icon: Headphones,
      color: 'from-purple-500 to-pink-500',
      description: 'เรียนรู้ในโลกเสมือนจริง 3D',
      stats: '+400% Retention',
      demo: 'vr-demo'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Certificates',
      icon: Link2,
      color: 'from-blue-500 to-cyan-500',
      description: 'ใบรับรองที่ไม่สามารถปลอมแปลงได้',
      stats: '100% Secure',
      demo: 'blockchain-demo'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Solutions',
      icon: Building2,
      color: 'from-green-500 to-emerald-500',
      description: 'โซลูชันระดับองค์กร',
      stats: '100K+ Users',
      demo: 'enterprise-demo'
    },
    {
      id: 'social',
      title: 'Social Learning',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
      description: 'เรียนรู้แบบสังคม',
      stats: '+600% Engagement',
      demo: 'social-demo'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-bold">
          🚀 Phase 3: Future Technology
        </Badge>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">เทคโนโลยีแห่งอนาคต</h2>
        <p className="text-slate-700 max-w-2xl mx-auto text-lg font-medium">
          สัมผัสประสบการณ์การเรียนรู้ที่ล้ำสมัยด้วยเทคโนโลยีที่จะเปลี่ยนแปลงโลกการศึกษา
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon
          return (
            <Card 
              key={feature.id}
              className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setActiveDemo(feature.demo)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-700 text-sm mb-3 font-medium">{feature.description}</p>
                <Badge className="bg-slate-100 text-slate-800 border-0 font-bold">
                  {feature.stats}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Interactive Demos */}
      <Tabs value={activeDemo || 'overview'} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white border-gray-200 shadow-md">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 text-slate-700 font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="vr-demo" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 text-slate-700 font-semibold">VR Demo</TabsTrigger>
          <TabsTrigger value="blockchain-demo" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 text-slate-700 font-semibold">Blockchain</TabsTrigger>
          <TabsTrigger value="enterprise-demo" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900 text-slate-700 font-semibold">Enterprise</TabsTrigger>
          <TabsTrigger value="social-demo" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 text-slate-700 font-semibold">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center text-xl font-bold">
                <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
                Phase 3 Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Revolutionary Features</h4>
                  <ul className="space-y-2 text-slate-700 font-medium">
                    <li className="flex items-center"><Eye className="w-5 h-5 mr-2 text-purple-600" /> VR/AR Immersive Learning</li>
                    <li className="flex items-center"><Shield className="w-5 h-5 mr-2 text-blue-600" /> Blockchain Security</li>
                    <li className="flex items-center"><Users className="w-5 h-5 mr-2 text-green-600" /> Enterprise Scale</li>
                    <li className="flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-orange-600" /> Social Collaboration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Expected Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Learning Retention</span>
                      <span className="text-purple-700 font-extrabold text-lg">+400%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Security Level</span>
                      <span className="text-blue-700 font-extrabold text-lg">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Enterprise Users</span>
                      <span className="text-green-700 font-extrabold text-lg">100K+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Social Engagement</span>
                      <span className="text-orange-700 font-extrabold text-lg">+600%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vr-demo" className="mt-6">
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Headphones className="w-5 h-5 mr-2" />
                VR/AR Learning Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Play className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-white">VR Learning Experience</p>
                  <p className="text-gray-300 text-sm">Click to start immersive demo</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">90+ FPS</div>
                  <div className="text-sm text-gray-300">Smooth Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">&lt;20ms</div>
                  <div className="text-sm text-gray-300">Low Latency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain-demo" className="mt-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Link2 className="w-5 h-5 mr-2" />
                Blockchain Certificate Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/20 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold">Certificate Hash:</span>
                  <Badge className="bg-blue-500/20 text-blue-300">Verified ✓</Badge>
                </div>
                <div className="font-mono text-sm text-gray-300 bg-black/30 p-3 rounded">
                  0x1a2b3c4d5e6f7890abcdef1234567890abcdef12
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">&lt;5s</div>
                    <div className="text-sm text-gray-300">Verification Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">∞</div>
                    <div className="text-sm text-gray-300">Permanent Storage</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enterprise-demo" className="mt-6">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Enterprise Dashboard Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-black/20 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">50K</div>
                  <div className="text-sm text-gray-300">Active Users</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4 text-center">
                  <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">25</div>
                  <div className="text-sm text-gray-300">Departments</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4 text-center">
                  <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-300">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social-demo" className="mt-6">
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Social Learning Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Study Group: React Mastery</div>
                      <div className="text-gray-300 text-sm">15 active members</div>
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm">
                    "มาช่วยกันทำโปรเจค React กันเถอะ! 🚀"
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">500+</div>
                    <div className="text-sm text-gray-300">Study Groups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">24/7</div>
                    <div className="text-sm text-gray-300">Live Sessions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          เริ่มใช้ Phase 3 Features
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}