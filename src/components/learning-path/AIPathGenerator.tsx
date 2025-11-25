'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Wand2,
  Brain,
  Target,
  Clock,
  Zap,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Award
} from 'lucide-react'

interface AIPathGeneratorProps {
  onPathGenerated?: (path: any) => void
}

export default function AIPathGenerator({ onPathGenerated }: AIPathGeneratorProps) {
  const [formData, setFormData] = useState({
    careerId: '',
    difficulty: 'INTERMEDIATE',
    timeCommitment: 10,
    learningStyle: 'mixed',
    skills: [] as string[],
    goals: ''
  })
  const [generating, setGenerating] = useState(false)
  const [generatedPath, setGeneratedPath] = useState<any>(null)
  const [skillAnalysis, setSkillAnalysis] = useState<any>(null)

  const careers = [
    { id: '1', title: 'Full-Stack Developer', category: 'Software Development' },
    { id: '2', title: 'Data Scientist', category: 'Data & Analytics' },
    { id: '3', title: 'UI/UX Designer', category: 'Design' }
  ]

  const skills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS',
    'TypeScript', 'AWS', 'Docker', 'Git'
  ]

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const analyzeSkills = async () => {
    try {
      const response = await fetch('/api/ai/skill-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerId: formData.careerId })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSkillAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('Error analyzing skills:', error)
    }
  }

  const generatePath = async () => {
    setGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          autoEnroll: false
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedPath(data.generatedPath)
        onPathGenerated?.(data.generatedPath)
      }
    } catch (error) {
      console.error('Error generating path:', error)
    } finally {
      setGenerating(false)
    }
  }

  const enrollInPath = async () => {
    try {
      const response = await fetch('/api/ai/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          autoEnroll: true
        })
      })

      if (response.ok) {
        // Redirect to learning paths dashboard
        window.location.href = '/learning-paths'
      }
    } catch (error) {
      console.error('Error enrolling in path:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!generatedPath ? (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-2xl">
              <Brain className="w-6 h-6 mr-3" />
              AI Learning Path Generator
            </CardTitle>
            <p className="text-gray-300">
              Get personalized learning recommendations powered by AI
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Career Goal */}
            <div className="space-y-2">
              <Label className="text-white">Career Goal</Label>
              <Select value={formData.careerId} onValueChange={(value) => {
                setFormData(prev => ({ ...prev, careerId: value }))
                if (value) analyzeSkills()
              }}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select your target career" />
                </SelectTrigger>
                <SelectContent>
                  {careers.map(career => (
                    <SelectItem key={career.id} value={career.id}>
                      {career.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skill Analysis Results */}
            {skillAnalysis && (
              <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Skill Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Readiness Level:</span>
                    <Badge className={`${
                      skillAnalysis.readinessLevel === 'READY' ? 'bg-green-500' :
                      skillAnalysis.readinessLevel === 'NEEDS_IMPROVEMENT' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      {skillAnalysis.readinessLevel.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Overall Score:</span>
                    <span className="text-white font-bold">{Math.round(skillAnalysis.overallScore)}%</span>
                  </div>
                  {skillAnalysis.skillGaps.length > 0 && (
                    <div>
                      <p className="text-gray-300 text-sm mb-2">Top Skills to Improve:</p>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.skillGaps.slice(0, 3).map((gap: any) => (
                          <Badge key={gap.skillId} variant="outline" className="text-orange-300">
                            {gap.skillName} (Gap: {gap.gap})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Difficulty Level */}
            <div className="space-y-2">
              <Label className="text-white">Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, difficulty: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Commitment */}
            <div className="space-y-2">
              <Label className="text-white">Weekly Time Commitment</Label>
              <Select value={formData.timeCommitment.toString()} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, timeCommitment: parseInt(value) }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 hours/week</SelectItem>
                  <SelectItem value="10">10 hours/week</SelectItem>
                  <SelectItem value="20">20 hours/week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Skills */}
            <div className="space-y-3">
              <Label className="text-white">Current Skills</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skills.map(skill => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.skills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <Label htmlFor={skill} className="text-gray-300 text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <Label className="text-white">Learning Goals (Optional)</Label>
              <Textarea
                placeholder="Describe your specific learning objectives..."
                value={formData.goals}
                onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button
              onClick={generatePath}
              disabled={!formData.careerId || generating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating AI Path...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Learning Path
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
              {generatedPath.title}
            </CardTitle>
            <p className="text-gray-300">{generatedPath.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Path Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm">Duration</p>
                    <p className="text-white text-xl font-bold">{generatedPath.estimatedHours}h</p>
                  </div>
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm">Steps</p>
                    <p className="text-white text-xl font-bold">{generatedPath.steps.length}</p>
                  </div>
                  <BookOpen className="w-6 h-6 text-green-500" />
                </div>
              </div>
              
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm">Completion</p>
                    <p className="text-white text-xl font-bold">{generatedPath.aiInsights.estimatedCompletion}</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Learning Steps */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Learning Steps</h4>
              {generatedPath.steps.map((step: any, index: number) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{step.title}</h5>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {step.type}
                        </Badge>
                        <span className="text-gray-400 text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.estimatedHours}h
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      Step {step.order}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
              <h4 className="text-white font-semibold mb-3">AI Recommendations</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                {generatedPath.aiInsights.recommendations.map((rec: string, index: number) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={enrollInPath}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Award className="w-4 h-4 mr-2" />
                Start Learning Path
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setGeneratedPath(null)}
                className="flex-1"
              >
                Generate New Path
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}