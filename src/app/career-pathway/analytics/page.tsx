'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Clock, DollarSign, Brain, Zap } from 'lucide-react'
import { careerNodes } from '@/lib/career/career-data'

export default function AnalyticsPage() {
  const [targetCareer, setTargetCareer] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const analyzeCareer = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/career-pathway/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetCareer,
          currentSkills: ['JavaScript', 'React', 'Node.js'],
          learningVelocity: 1.0
        })
      })
      const data = await response.json()
      if (data.success) {
        setAnalysis(data.data)
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
          <Badge className="mb-4 bg-purple-100 text-purple-800">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered Analytics
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Predictive Career Analytics</h1>
          <p className="text-gray-600">AI วิเคราะห์โอกาสความสำเร็จและแนะนำเส้นทาง</p>
        </div>

        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle>เลือกอาชีพเป้าหมาย</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">เลือกอาชีพที่ต้องการวิเคราะห์</option>
              {careerNodes.map(node => (
                <option key={node.id} value={node.id}>{node.title}</option>
              ))}
            </select>

            <Button
              onClick={analyzeCareer}
              disabled={!targetCareer || loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'กำลังวิเคราะห์...' : 'วิเคราะห์ด้วย AI'}
              <Zap className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <>
            <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">AI Predictive Analysis</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <Target className="h-8 w-8 mb-2" />
                    <div className="text-3xl font-bold">{analysis.successProbability}%</div>
                    <div className="text-sm text-purple-100">Success Rate</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <Clock className="h-8 w-8 mb-2" />
                    <div className="text-3xl font-bold">{analysis.timeToComplete}</div>
                    <div className="text-sm text-purple-100">เดือน</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <TrendingUp className="h-8 w-8 mb-2" />
                    <div className="text-3xl font-bold">{analysis.marketDemand}%</div>
                    <div className="text-sm text-purple-100">Market Demand</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <DollarSign className="h-8 w-8 mb-2" />
                    <div className="text-3xl font-bold">+{analysis.salaryGrowth}%</div>
                    <div className="text-sm text-purple-100">Salary Growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Difficulty Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">{analysis.difficulty}</span>
                    <Badge className={
                      analysis.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      analysis.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      analysis.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {analysis.difficulty}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        analysis.difficulty === 'Easy' ? 'bg-green-600' :
                        analysis.difficulty === 'Medium' ? 'bg-yellow-600' :
                        analysis.difficulty === 'Hard' ? 'bg-orange-600' :
                        'bg-red-600'
                      }`}
                      style={{ 
                        width: `${
                          analysis.difficulty === 'Easy' ? 25 :
                          analysis.difficulty === 'Medium' ? 50 :
                          analysis.difficulty === 'Hard' ? 75 : 100
                        }%` 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Success Probability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">{analysis.successProbability}%</span>
                    <Badge className={
                      analysis.successProbability >= 70 ? 'bg-green-100 text-green-800' :
                      analysis.successProbability >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {analysis.successProbability >= 70 ? 'High' :
                       analysis.successProbability >= 50 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        analysis.successProbability >= 70 ? 'bg-green-600' :
                        analysis.successProbability >= 50 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${analysis.successProbability}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-gray-900">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}