'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, ArrowRight, Target } from 'lucide-react'
import { skillTaxonomy } from '@/lib/career/career-data'

export default function AssessmentPage() {
  const [step, setStep] = useState(1)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const calculateScore = () => {
    const scores = {
      technical: selectedSkills.filter(s => skillTaxonomy.technical.includes(s)).length,
      data: selectedSkills.filter(s => skillTaxonomy.data.includes(s)).length,
      soft: selectedSkills.filter(s => skillTaxonomy.soft.includes(s)).length,
      business: selectedSkills.filter(s => skillTaxonomy.business.includes(s)).length,
    }
    
    const total = selectedSkills.length
    const maxPossible = Object.values(skillTaxonomy).flat().length
    const percentage = Math.round((total / maxPossible) * 100)
    
    setResult({ scores, total, percentage })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Assessment</h1>
          <p className="text-gray-600">ประเมินทักษะของคุณใน 8 มิติ</p>
        </div>

        {!result ? (
          <>
            <Card className="bg-white shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {s}
                      </div>
                      {s < 4 && <div className={`w-20 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {step === 1 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {skillTaxonomy.technical.slice(0, 20).map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSkills.includes(skill)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedSkills.includes(skill) ? (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{skill}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full mt-6 bg-blue-600">
                    ถัดไป <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Data & Analytics Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {skillTaxonomy.data.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSkills.includes(skill)
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedSkills.includes(skill) ? (
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{skill}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                      ย้อนกลับ
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1 bg-purple-600">
                      ถัดไป <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Soft Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillTaxonomy.soft.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSkills.includes(skill)
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedSkills.includes(skill) ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{skill}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                      ย้อนกลับ
                    </Button>
                    <Button onClick={() => setStep(4)} className="flex-1 bg-green-600">
                      ถัดไป <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Business Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillTaxonomy.business.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSkills.includes(skill)
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedSkills.includes(skill) ? (
                            <CheckCircle className="h-5 w-5 text-orange-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{skill}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button onClick={() => setStep(3)} variant="outline" className="flex-1">
                      ย้อนกลับ
                    </Button>
                    <Button onClick={calculateScore} className="flex-1 bg-orange-600">
                      ดูผลการประเมิน <Target className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl mb-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">ผลการประเมินทักษะ</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">{result.total}</div>
                    <div className="text-sm text-blue-100">ทักษะทั้งหมด</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">{result.percentage}%</div>
                    <div className="text-sm text-blue-100">คะแนนรวม</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">{result.scores.technical}</div>
                    <div className="text-sm text-blue-100">Technical</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">{result.scores.data}</div>
                    <div className="text-sm text-blue-100">Data</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Skill Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Technical Skills</span>
                        <span className="text-blue-600 font-bold">{result.scores.technical}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full"
                          style={{ width: `${(result.scores.technical / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Data Skills</span>
                        <span className="text-purple-600 font-bold">{result.scores.data}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-600 h-3 rounded-full"
                          style={{ width: `${(result.scores.data / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Soft Skills</span>
                        <span className="text-green-600 font-bold">{result.scores.soft}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-600 h-3 rounded-full"
                          style={{ width: `${(result.scores.soft / 11) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Business Skills</span>
                        <span className="text-orange-600 font-bold">{result.scores.business}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-orange-600 h-3 rounded-full"
                          style={{ width: `${(result.scores.business / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>ทักษะที่เลือก</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skill => (
                      <Badge key={skill} className="bg-blue-100 text-blue-800 px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex gap-4">
              <Button onClick={() => { setResult(null); setStep(1); setSelectedSkills([]) }} variant="outline" className="flex-1">
                ประเมินใหม่
              </Button>
              <Button className="flex-1 bg-blue-600" onClick={() => window.location.href = '/career-pathway/planner'}>
                วางแผนเส้นทางอาชีพ <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}