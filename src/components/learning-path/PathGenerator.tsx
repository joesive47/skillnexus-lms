'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Wand2,
  Target,
  Clock,
  Brain,
  Zap,
  BookOpen,
  Award,
  TrendingUp,
  Users,
  Sparkles
} from 'lucide-react'

interface PathGeneratorProps {
  onPathGenerated?: (path: any) => void
}

export default function PathGenerator({ onPathGenerated }: PathGeneratorProps) {
  const [formData, setFormData] = useState({
    careerGoal: '',
    currentLevel: 'BEGINNER',
    timeCommitment: '5',
    learningStyle: 'mixed',
    skills: [] as string[],
    goals: ''
  })
  const [generating, setGenerating] = useState(false)
  const [generatedPath, setGeneratedPath] = useState<any>(null)

  const careers = [
    { id: '1', title: 'Full-Stack Developer', category: 'Software Development' },
    { id: '2', title: 'Data Scientist', category: 'Data & Analytics' },
    { id: '3', title: 'UI/UX Designer', category: 'Design' },
    { id: '4', title: 'DevOps Engineer', category: 'Infrastructure' },
    { id: '5', title: 'Mobile Developer', category: 'Mobile Development' }
  ]

  const skills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS',
    'TypeScript', 'AWS', 'Docker', 'Git', 'MongoDB', 'PostgreSQL'
  ]

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const generatePath = async () => {
    setGenerating(true)
    
    // Simulate AI path generation
    setTimeout(() => {
      const mockPath = {
        id: `generated_${Date.now()}`,
        title: `Path to ${careers.find(c => c.id === formData.careerGoal)?.title || 'Your Goal'}`,
        description: `Personalized learning journey based on your ${formData.currentLevel.toLowerCase()} level and ${formData.timeCommitment}h/week commitment`,
        difficulty: formData.currentLevel,
        estimatedHours: parseInt(formData.timeCommitment) * 12, // 12 weeks estimate
        progress: 0,
        steps: [
          {
            id: 'step1',
            title: 'Foundation Assessment',
            type: 'SKILL_ASSESSMENT',
            estimatedHours: 1,
            isCompleted: false,
            isLocked: false,
            order: 1
          },
          {
            id: 'step2',
            title: 'Core Fundamentals',
            type: 'COURSE',
            estimatedHours: 20,
            isCompleted: false,
            isLocked: true,
            order: 2
          },
          {
            id: 'step3',
            title: 'Practical Application',
            type: 'PROJECT',
            estimatedHours: 15,
            isCompleted: false,
            isLocked: true,
            order: 3
          }
        ],
        aiInsights: {
          strengths: formData.skills,
          recommendations: [
            'Start with foundation assessment to identify knowledge gaps',
            'Focus on hands-on projects to reinforce learning',
            'Join community discussions for peer support'
          ],
          estimatedCompletion: '12 weeks'
        }
      }
      
      setGeneratedPath(mockPath)
      setGenerating(false)
      onPathGenerated?.(mockPath)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!generatedPath ? (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-2xl">
              <Wand2 className="w-6 h-6 mr-3" />
              AI Learning Path Generator
            </CardTitle>
            <p className="text-gray-300">
              Let our AI create a personalized learning path tailored to your goals and preferences
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Career Goal */}
            <div className="space-y-2">
              <Label className="text-white">Career Goal</Label>
              <Select value={formData.careerGoal} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, careerGoal: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select your target career" />
                </SelectTrigger>
                <SelectContent>
                  {careers.map(career => (
                    <SelectItem key={career.id} value={career.id}>
                      {career.title} - {career.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Level */}
            <div className="space-y-2">
              <Label className="text-white">Current Experience Level</Label>
              <Select value={formData.currentLevel} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, currentLevel: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner - Just starting out</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate - Some experience</SelectItem>
                  <SelectItem value="ADVANCED">Advanced - Significant experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Commitment */}
            <div className="space-y-2">
              <Label className="text-white">Weekly Time Commitment</Label>
              <Select value={formData.timeCommitment} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, timeCommitment: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 hours/week - Casual pace</SelectItem>
                  <SelectItem value="5">5 hours/week - Steady progress</SelectItem>
                  <SelectItem value="10">10 hours/week - Accelerated</SelectItem>
                  <SelectItem value="20">20+ hours/week - Intensive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Learning Style */}
            <div className="space-y-2">
              <Label className="text-white">Preferred Learning Style</Label>
              <Select value={formData.learningStyle} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, learningStyle: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual - Videos, diagrams, infographics</SelectItem>
                  <SelectItem value="hands-on">Hands-on - Projects, coding exercises</SelectItem>
                  <SelectItem value="reading">Reading - Documentation, articles</SelectItem>
                  <SelectItem value="mixed">Mixed - Combination of all styles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Existing Skills */}
            <div className="space-y-3">
              <Label className="text-white">Current Skills (Select all that apply)</Label>
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

            {/* Additional Goals */}
            <div className="space-y-2">
              <Label className="text-white">Additional Goals or Preferences (Optional)</Label>
              <Textarea
                placeholder="e.g., Focus on practical projects, prepare for specific certifications, etc."
                value={formData.goals}
                onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button
              onClick={generatePath}
              disabled={!formData.careerGoal || generating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Your Path...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate My Learning Path
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Generated Path Preview */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Target className="w-6 h-6 mr-3" />
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
                      <p className="text-blue-300 text-sm">Total Duration</p>
                      <p className="text-white text-xl font-bold">{generatedPath.estimatedHours}h</p>
                    </div>
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm">Learning Steps</p>
                      <p className="text-white text-xl font-bold">{generatedPath.steps.length}</p>
                    </div>
                    <BookOpen className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">Difficulty</p>
                      <p className="text-white text-xl font-bold">{generatedPath.difficulty}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Insights & Recommendations
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-orange-300 text-sm font-medium">Your Strengths:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {generatedPath.aiInsights.strengths.map((skill: string) => (
                        <Badge key={skill} className="bg-green-500/20 text-green-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-orange-300 text-sm font-medium">Recommendations:</p>
                    <ul className="text-gray-300 text-sm mt-1 space-y-1">
                      {generatedPath.aiInsights.recommendations.map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Award className="w-4 h-4 mr-2" />
                  Start Learning Path
                </Button>
                <Button variant="outline" className="flex-1">
                  <Zap className="w-4 h-4 mr-2" />
                  Customize Path
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setGeneratedPath(null)}
                >
                  Generate New Path
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}