"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Key, Trophy, Star, Award, Download, QrCode, Plus, Clock, Target } from "lucide-react"

interface CertificationKey {
  id: string
  nameTh: string
  nameEn: string
  path: string
  score: number
  hours: number
  completedDate: string
  qrCode: string
  color: string
}

interface MasterCertification {
  id: string
  nameTh: string
  nameEn: string
  path: string
  keys: CertificationKey[]
  totalHours: number
  averageScore: number
  completedDate: string
  qrCode: string
}

export default function BardCertificationPage() {
  const [certificationKeys] = useState<CertificationKey[]>([
    {
      id: "1",
      nameTh: "พื้นฐานการวิเคราะห์ข้อมูล",
      nameEn: "Data Analytics Fundamentals",
      path: "Data Analytics",
      score: 95,
      hours: 40,
      completedDate: "2024-11-15",
      qrCode: "QR_DA_001",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: "2", 
      nameTh: "พื้นฐานการเรียนรู้ของเครื่อง",
      nameEn: "Machine Learning Basics",
      path: "Data Analytics",
      score: 88,
      hours: 35,
      completedDate: "2024-11-20",
      qrCode: "QR_ML_002",
      color: "from-green-500 to-blue-600"
    },
    {
      id: "3",
      nameTh: "ธุรกิจอัจฉริยะ",
      nameEn: "Business Intelligence",
      path: "Data Analytics", 
      score: 92,
      hours: 30,
      completedDate: "2024-11-25",
      qrCode: "QR_BI_003",
      color: "from-purple-500 to-pink-600"
    }
  ])

  const [masterCertifications] = useState<MasterCertification[]>([
    {
      id: "master_1",
      nameTh: "ผู้เชี่ยวชาญการวิเคราะห์ข้อมูล",
      nameEn: "Data Analytics Master",
      path: "Data Analytics",
      keys: certificationKeys,
      totalHours: 105,
      averageScore: 92,
      completedDate: "2024-11-25",
      qrCode: "QR_MASTER_DA_001"
    }
  ])

  const CertificationKeyCard = ({ certKey }: { certKey: CertificationKey }) => (
    <Card className="relative overflow-hidden border-2 border-yellow-300 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${certKey.color} opacity-10`} />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full bg-gradient-to-br ${certKey.color} shadow-lg`}>
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg leading-tight">{certKey.nameTh}</CardTitle>
              <CardTitle className="text-base text-gray-600 font-medium">{certKey.nameEn}</CardTitle>
              <CardDescription className="font-medium text-blue-600 mt-1">
                🔑 {certKey.path} Key
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Key #{certKey.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-2xl text-green-600">{certKey.score}%</span>
            </div>
            <p className="text-xs text-gray-600">Score</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-2xl text-blue-600">{certKey.hours}h</span>
            </div>
            <p className="text-xs text-gray-600">Hours</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <QrCode className="w-4 h-4 text-purple-500" />
              <span className="font-bold text-xs text-purple-600">{certKey.qrCode}</span>
            </div>
            <p className="text-xs text-gray-600">Verification</p>
          </div>
        </div>
        
        <div className="bg-white/60 rounded-lg p-2 border border-gray-200 mb-3">
          <p className="text-sm font-bold text-gray-800">นายทวีศักดิ์ เจริญศิลป์</p>
          <p className="text-xs font-medium text-gray-700">Mr.Taweesak Jaroensin</p>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-gray-600">Completed: {certKey.completedDate}</span>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const MasterCertificationCard = ({ master }: { master: MasterCertification }) => (
    <Card className="relative overflow-hidden border-4 border-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-transparent to-yellow-300/20" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
      
      <CardHeader className="relative text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent leading-tight">
          🏆 {master.nameTh}
        </CardTitle>
        <CardTitle className="text-xl font-bold text-gray-700 mb-2">
          {master.nameEn}
        </CardTitle>
        
        <div className="bg-white/60 rounded-lg p-3 border border-yellow-200 mb-4">
          <p className="text-lg font-bold text-gray-800">นายทวีศักดิ์ เจริญศิลป์</p>
          <p className="text-base font-semibold text-gray-700">Mr.Taweesak Jaroensin</p>
        </div>
        
        <CardDescription className="text-lg font-semibold text-purple-700">
          Master Certification - {master.path}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Keys Equation */}
        <div className="bg-white/80 rounded-lg p-4 border-2 border-yellow-200">
          <h3 className="text-center font-bold text-gray-800 mb-3">🔑 Certification Keys Formula</h3>
          <div className="flex items-center justify-center flex-wrap gap-2 text-sm">
            {master.keys.map((key, index) => (
              <div key={key.id} className="flex items-center">
                <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300">
                  🔑 Key{index + 1}
                </Badge>
                {index < master.keys.length - 1 && (
                  <span className="mx-2 text-gray-600 font-bold">+</span>
                )}
              </div>
            ))}
            <span className="mx-3 text-xl font-bold text-yellow-600">=</span>
            <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-lg px-4 py-2">
              🏆 Master
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center bg-white/60 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Key className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-2xl text-yellow-700">{master.keys.length}</span>
            </div>
            <p className="text-xs text-gray-700 font-medium">Keys Unlocked</p>
          </div>
          
          <div className="text-center bg-white/60 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-bold text-2xl text-green-700">{master.averageScore}%</span>
            </div>
            <p className="text-xs text-gray-700 font-medium">Avg Score</p>
          </div>
          
          <div className="text-center bg-white/60 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-2xl text-blue-700">{master.totalHours}h</span>
            </div>
            <p className="text-xs text-gray-700 font-medium">Total Hours</p>
          </div>
          
          <div className="text-center bg-white/60 rounded-lg p-3 border border-purple-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <QrCode className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-xs text-purple-700">{master.qrCode}</span>
            </div>
            <p className="text-xs text-gray-700 font-medium">Master QR</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-yellow-200">
          <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold">
            <Download className="w-4 h-4 mr-2" />
            Download Master Certificate
          </Button>
          <Button variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
            <QrCode className="w-4 h-4 mr-2" />
            Verify
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600 bg-yellow-50 rounded-lg p-2 border border-yellow-200">
          <strong>Completed:</strong> {master.completedDate} | <strong>Path:</strong> {master.path}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            🏆 BARD Certification System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Collect <strong>Certification Keys</strong> 🔑 to unlock <strong>Master Certificates</strong> 🏆
          </p>
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg px-6 py-2">
              Keys Concept: Key₁ + Key₂ + Key₃ = 🏆 Master
            </Badge>
          </div>
        </div>

        {/* Master Certifications */}
        <section className="space-y-6">
          <div className="flex items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-600" />
              Master Certifications
            </h2>
          </div>
          
          <div className="grid gap-6">
            {masterCertifications.map((master) => (
              <MasterCertificationCard key={master.id} master={master} />
            ))}
          </div>
        </section>

        {/* Certification Keys */}
        <section className="space-y-6">
          <div className="flex items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Key className="w-7 h-7 text-blue-600" />
              Unlocked Certification Keys
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationKeys.map((certKey) => (
              <CertificationKeyCard key={certKey.id} certKey={certKey} />
            ))}
          </div>
        </section>

        {/* Certification Paths */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Award className="w-7 h-7 text-purple-600" />
            Available Certification Paths
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { nameTh: "การวิเคราะห์ข้อมูล", nameEn: "Data Analytics", keys: 3, color: "from-blue-500 to-purple-600", icon: "📊" },
              { nameTh: "การเรียนรู้ของเครื่อง", nameEn: "Machine Learning", keys: 4, color: "from-green-500 to-blue-600", icon: "🤖" },
              { nameTh: "ธุรกิจอัจฉริยะ", nameEn: "Business Intelligence", keys: 3, color: "from-purple-500 to-pink-600", icon: "📈" },
              { nameTh: "คลาวด์คอมพิวติ้ง", nameEn: "Cloud Computing", keys: 5, color: "from-orange-500 to-red-600", icon: "☁️" }
            ].map((path, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-blue-300">
                <CardContent className="p-4 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${path.color} flex items-center justify-center text-2xl`}>
                    {path.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 leading-tight">{path.nameTh}</h3>
                  <h4 className="text-sm text-gray-600 mb-2">{path.nameEn}</h4>
                  <Badge variant="outline" className="mb-3">
                    {path.keys} Keys Required
                  </Badge>
                  <Button size="sm" variant="outline" className="w-full">
                    View Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}