'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Headphones, 
  Eye, 
  Hand, 
  Zap, 
  Play, 
  Settings,
  Volume2,
  RotateCcw,
  Maximize
} from 'lucide-react'

interface VRScene {
  id: string
  title: string
  description: string
  type: 'simulation' | 'environment' | 'interactive'
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  thumbnail: string
}

export default function VRLearning() {
  const [isVRSupported, setIsVRSupported] = useState(false)
  const [isVRActive, setIsVRActive] = useState(false)
  const [selectedScene, setSelectedScene] = useState<VRScene | null>(null)

  const vrScenes: VRScene[] = [
    {
      id: '1',
      title: 'JavaScript Virtual Lab',
      description: 'เรียนรู้ JavaScript ในสภาพแวดล้อม 3D',
      type: 'interactive',
      duration: '45 นาที',
      difficulty: 'beginner',
      thumbnail: '/vr/js-lab.jpg'
    },
    {
      id: '2',
      title: 'Data Center Simulation',
      description: 'สำรวจ Data Center แบบ Virtual',
      type: 'simulation',
      duration: '30 นาที',
      difficulty: 'intermediate',
      thumbnail: '/vr/datacenter.jpg'
    },
    {
      id: '3',
      title: 'AI Neural Network Visualization',
      description: 'เห็น Neural Network ทำงานแบบ 3D',
      type: 'environment',
      duration: '60 นาที',
      difficulty: 'advanced',
      thumbnail: '/vr/neural.jpg'
    }
  ]

  useEffect(() => {
    setIsVRSupported('xr' in navigator)
  }, [])

  const startVRSession = async (scene: VRScene) => {
    setSelectedScene(scene)
    setIsVRActive(true)
    // VR session logic would go here
  }

  const exitVR = () => {
    setIsVRActive(false)
    setSelectedScene(null)
  }

  if (isVRActive && selectedScene) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Headphones className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">VR Session Active</h2>
          <p className="text-xl mb-6">{selectedScene.title}</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={exitVR} variant="outline">
              Exit VR
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Headphones className="w-8 h-8 mr-3 text-purple-400" />
            VR Learning Experience
          </h1>
          <p className="text-gray-400 mt-1">การเรียนรู้แบบ Immersive ด้วย Virtual Reality</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={isVRSupported ? 'bg-green-600' : 'bg-red-600'}>
            {isVRSupported ? 'VR Supported' : 'VR Not Supported'}
          </Badge>
        </div>
      </div>

      {!isVRSupported && (
        <Card className="bg-yellow-600/20 border-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-yellow-400 font-semibold">VR Not Supported</h3>
                <p className="text-yellow-300 text-sm">
                  เบราว์เซอร์ของคุณไม่รองรับ WebXR กรุณาใช้ Chrome หรือ Edge เวอร์ชันล่าสุด
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vrScenes.map((scene) => (
          <Card key={scene.id} className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-purple-500 transition-colors">
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <Badge className="bg-purple-600">
                  {scene.type.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">{scene.title}</CardTitle>
              <p className="text-gray-400 text-sm">{scene.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">ระยะเวลา: {scene.duration}</span>
                <Badge variant="outline" className={
                  scene.difficulty === 'beginner' ? 'border-green-500 text-green-400' :
                  scene.difficulty === 'intermediate' ? 'border-yellow-500 text-yellow-400' :
                  'border-red-500 text-red-400'
                }>
                  {scene.difficulty}
                </Badge>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => startVRSession(scene)}
                disabled={!isVRSupported}
              >
                <Headphones className="w-4 h-4 mr-2" />
                เริ่ม VR Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">VR Controls & Features</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <Hand className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">Hand Tracking</h3>
            <p className="text-gray-400 text-sm">ใช้มือโต้ตอบ</p>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">Eye Tracking</h3>
            <p className="text-gray-400 text-sm">ติดตามการมอง</p>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <Volume2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">Spatial Audio</h3>
            <p className="text-gray-400 text-sm">เสียง 3D</p>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">Haptic Feedback</h3>
            <p className="text-gray-400 text-sm">การสั่นสะเทือน</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}