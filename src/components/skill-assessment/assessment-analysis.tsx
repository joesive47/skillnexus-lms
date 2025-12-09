'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BookOpen, 
  Clock, 
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import type { AssessmentAnalysis } from '@/lib/assessment-analyzer'

interface AssessmentAnalysisProps {
  analysis: AssessmentAnalysis
  careerTitle: string
}

export function AssessmentAnalysisView({ analysis, careerTitle }: AssessmentAnalysisProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'text-purple-600'
      case 'Advanced': return 'text-blue-600'
      case 'Intermediate': return 'text-yellow-600'
      case 'Beginner': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            สรุปผลการประเมิน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getLevelColor(analysis.overallLevel)}`}>
                {analysis.overallScore.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">คะแนนรวม</div>
              <Badge className="mt-2">{analysis.overallLevel}</Badge>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {analysis.careerReadiness.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">ความพร้อมในอาชีพ</div>
              <Progress value={analysis.careerReadiness} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {analysis.estimatedLearningTime}
              </div>
              <div className="text-sm text-gray-600 mt-1">สัปดาห์ที่แนะนำ</div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                เวลาเรียนโดยประมาณ
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            รายละเอียดทักษะ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.skillBreakdown.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{skill.skillName}</span>
                    <Badge variant="outline" className={getLevelColor(skill.level)}>
                      {skill.level}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold">{skill.percentage.toFixed(1)}%</span>
                </div>
                
                <Progress value={skill.percentage} className="mb-3" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {skill.strengths.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-green-600 font-medium mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        จุดแข็ง
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {skill.strengths.slice(0, 2).map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {skill.weakPoints.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-orange-600 font-medium mb-1">
                        <AlertCircle className="w-4 h-4" />
                        ควรพัฒนา
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {skill.weakPoints.slice(0, 2).map((weak, i) => (
                          <li key={i}>• {weak}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weakest Skills */}
      {analysis.weakestSkills.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingDown className="w-5 h-5" />
              ทักษะที่ต้องพัฒนาเร่งด่วน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.weakestSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div>
                    <div className="font-medium">{skill.skillName}</div>
                    <div className="text-sm text-gray-600">
                      คะแนน: {skill.score}/{skill.maxScore}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">
                      {skill.percentage.toFixed(1)}%
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {skill.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strongest Skills */}
      {analysis.strongestSkills.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              ทักษะที่แข็งแกร่ง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.strongestSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div>
                    <div className="font-medium">{skill.skillName}</div>
                    <div className="text-sm text-gray-600">
                      คะแนน: {skill.score}/{skill.maxScore}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {skill.percentage.toFixed(1)}%
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {skill.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            หลักสูตรแนะนำ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.recommendations
              .sort((a, b) => {
                const priority = { High: 3, Medium: 2, Low: 1 }
                return priority[b.priority as keyof typeof priority] - priority[a.priority as keyof typeof priority]
              })
              .map((rec, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{rec.courseTitle}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.estimatedDuration}
                        </span>
                        <span>•</span>
                        <span>{rec.difficulty}</span>
                        <span>•</span>
                        <span>{rec.relevantSkills.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={rec.courseLink} target="_blank">
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <span>เรียนหลักสูตรนี้</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            แผนการเรียนรู้แนะนำ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.learningPath.map((step, index) => (
              <div key={index} className="relative">
                {index < analysis.learningPath.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-purple-300" />
                )}
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-lg mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="font-medium text-purple-600 mb-1">ทักษะที่จะพัฒนา:</div>
                        <ul className="text-gray-600 space-y-1">
                          {step.skills.map((skill, i) => (
                            <li key={i}>• {skill}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="font-medium text-purple-600 mb-1">หลักสูตรแนะนำ:</div>
                        <ul className="text-gray-600 space-y-1">
                          {step.courses.slice(0, 2).map((course, i) => (
                            <li key={i}>• {course}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>ระยะเวลา: {step.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link href="/courses" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
            <BookOpen className="w-4 h-4 mr-2" />
            เริ่มเรียนเลย
          </Button>
        </Link>
        
        <Link href={`/career-pathway?career=${encodeURIComponent(careerTitle)}`} className="flex-1">
          <Button variant="outline" className="w-full">
            <Target className="w-4 h-4 mr-2" />
            ดู Career Path
          </Button>
        </Link>
      </div>
    </div>
  )
}
