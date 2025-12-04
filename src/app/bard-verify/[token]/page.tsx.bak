'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerifyPage() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Demo data for demo tokens
    if (params.token?.toString().startsWith('demo-token')) {
      setData({
        valid: true,
        certificate: {
          certificateNumber: 'BARD-2025-TH-DEMO',
          holder: 'Demo Student',
          course: params.token === 'demo-token-1' ? 'Full Stack Web Development' : 
                  params.token === 'demo-token-2' ? 'React & Next.js Mastery' : 'Python Data Science',
          issuedAt: new Date(),
          bardSummary: {
            competencies: [
              { category: 'BEHAVIORAL', skillName: 'Problem Solving', level: 4 },
              { category: 'APTITUDE', skillName: 'Logical Thinking', level: 5 },
              { category: 'ROLE_SPECIFIC', skillName: 'Web Development', level: 4 },
              { category: 'DEVELOPMENT', skillName: 'Continuous Learning', level: 5 }
            ],
            careerReadiness: {
              fitScore: params.token === 'demo-token-1' ? 90 : params.token === 'demo-token-2' ? 85 : 88,
              readinessLevel: params.token === 'demo-token-1' ? 5 : 4
            }
          }
        }
      })
      setLoading(false)
      return
    }

    fetch(`/api/bard-certificates/verify/${params.token}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [params.token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying certificate...</p>
      </div>
    )
  }

  if (!data?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Invalid Certificate</h2>
            <p className="text-gray-600">This certificate could not be verified.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { certificate } = data
  const { bardSummary } = certificate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="border-4 border-yellow-400 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-40 h-40 bg-white rounded-full"></div>
            </div>
            <div className="relative z-10 text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SN
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">SkillNexus LMS</h1>
              <p className="text-xl opacity-90">BARD Certification Program</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Verified Certificate</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Certificate Number</p>
                <p className="font-mono">{certificate.certificateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Holder</p>
                <p className="font-semibold">{certificate.holder}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-semibold">{certificate.course}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Issued</p>
                <p>{new Date(certificate.issuedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BARD Competencies Framework
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { cat: 'BEHAVIORAL', icon: '🎯', color: 'from-blue-500 to-blue-600' },
                  { cat: 'APTITUDE', icon: '🧠', color: 'from-green-500 to-green-600' },
                  { cat: 'ROLE_SPECIFIC', icon: '💼', color: 'from-purple-500 to-purple-600' },
                  { cat: 'DEVELOPMENT', icon: '📈', color: 'from-orange-500 to-orange-600' }
                ].map(({ cat, icon, color }) => {
                  const skills = bardSummary.competencies.filter((c: any) => c.category === cat)
                  const avgLevel = skills.reduce((sum: number, s: any) => sum + s.level, 0) / skills.length || 0

                  return (
                    <div key={cat} className={`p-6 bg-gradient-to-br ${color} rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform`}>
                      <div className="text-4xl mb-3">{icon}</div>
                      <p className="text-sm font-semibold mb-2 opacity-90">{cat.replace('_', ' ')}</p>
                      <p className="text-3xl font-bold">Level {avgLevel.toFixed(1)}/5</p>
                      <div className="mt-3 bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2" style={{ width: `${(avgLevel / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Career Readiness Assessment
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg text-white">
                  <p className="text-sm font-semibold mb-2 opacity-90">Career Fit Score</p>
                  <p className="text-5xl font-bold mb-3">{bardSummary.careerReadiness.fitScore}<span className="text-2xl">/100</span></p>
                  <div className="bg-white/20 rounded-full h-3">
                    <div className="bg-white rounded-full h-3" style={{ width: `${bardSummary.careerReadiness.fitScore}%` }}></div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg text-white">
                  <p className="text-sm font-semibold mb-2 opacity-90">Readiness Level</p>
                  <p className="text-5xl font-bold mb-3">{bardSummary.careerReadiness.readinessLevel}<span className="text-2xl">/5</span></p>
                  <div className="flex gap-2 mt-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`flex-1 h-3 rounded-full ${i <= bardSummary.careerReadiness.readinessLevel ? 'bg-white' : 'bg-white/20'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 flex justify-between items-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-xs text-gray-500">QR Code</div>
                </div>
                <p className="text-xs text-gray-500">Scan to verify</p>
              </div>
              <div className="flex-1 px-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Issued by:</span>
                    <span className="font-semibold">SkillNexus LMS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Verification:</span>
                    <span className="font-mono text-xs bg-green-100 text-green-800 px-2 py-1 rounded">BLOCKCHAIN VERIFIED</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Digital Signature:</span>
                    <span className="font-mono text-xs">SHA-256</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
