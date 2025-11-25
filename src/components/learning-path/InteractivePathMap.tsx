'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  Circle,
  Lock,
  Play,
  Clock,
  Star,
  ArrowRight,
  Target
} from 'lucide-react'

interface PathStep {
  id: string
  title: string
  type: string
  estimatedHours: number
  isCompleted: boolean
  isLocked: boolean
  isActive: boolean
  order: number
  score?: number
  prerequisites: string[]
}

interface InteractivePathMapProps {
  pathId: string
  steps: PathStep[]
  onStepClick?: (stepId: string) => void
}

export default function InteractivePathMap({ pathId, steps, onStepClick }: InteractivePathMapProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [pathProgress, setPathProgress] = useState(0)

  useEffect(() => {
    const completedSteps = steps.filter(step => step.isCompleted).length
    const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0
    setPathProgress(progress)
  }, [steps])

  const getStepIcon = (step: PathStep) => {
    if (step.isCompleted) return <CheckCircle className="w-6 h-6 text-green-500" />
    if (step.isLocked) return <Lock className="w-6 h-6 text-gray-400" />
    if (step.isActive) return <Play className="w-6 h-6 text-blue-500" />
    return <Circle className="w-6 h-6 text-gray-500" />
  }

  const getStepColor = (step: PathStep) => {
    if (step.isCompleted) return 'border-green-500 bg-green-500/10'
    if (step.isLocked) return 'border-gray-400 bg-gray-400/10'
    if (step.isActive) return 'border-blue-500 bg-blue-500/10'
    return 'border-gray-500 bg-gray-500/10'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      COURSE: 'bg-blue-500',
      SKILL_ASSESSMENT: 'bg-purple-500',
      PROJECT: 'bg-orange-500',
      QUIZ: 'bg-green-500'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500'
  }

  const handleStepClick = (step: PathStep) => {
    if (!step.isLocked) {
      setSelectedStep(step.id)
      onStepClick?.(step.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Learning Path Progress</h3>
            <span className="text-gray-300">{Math.round(pathProgress)}%</span>
          </div>
          <Progress value={pathProgress} className="h-3 mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {steps.filter(s => s.isCompleted).length}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {steps.filter(s => s.isActive).length}
              </div>
              <div className="text-sm text-gray-400">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">
                {steps.filter(s => s.isLocked).length}
              </div>
              <div className="text-sm text-gray-400">Locked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Path Map */}
      <div className="relative">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-600 z-0"></div>
              )}
              
              {/* Step Card */}
              <Card 
                className={`relative z-10 cursor-pointer transition-all duration-200 hover:scale-105 ${getStepColor(step)} ${
                  selectedStep === step.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => handleStepClick(step)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Step Icon */}
                    <div className="flex-shrink-0">
                      {getStepIcon(step)}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium truncate">{step.title}</h4>
                        <Badge className={`${getTypeColor(step.type)} text-white text-xs`}>
                          {step.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {step.estimatedHours}h
                        </span>
                        
                        {step.score && (
                          <span className="flex items-center text-green-400">
                            <Star className="w-4 h-4 mr-1" />
                            {step.score}%
                          </span>
                        )}
                        
                        <span className="text-xs">Step {step.order}</span>
                      </div>

                      {/* Prerequisites */}
                      {step.prerequisites.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Requires: {step.prerequisites.length} prerequisite(s)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {step.isCompleted ? (
                        <Button size="sm" variant="outline" className="text-green-400 border-green-400">
                          Review
                        </Button>
                      ) : step.isActive ? (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Continue
                        </Button>
                      ) : step.isLocked ? (
                        <Button size="sm" variant="outline" disabled>
                          Locked
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Step Details Panel */}
      {selectedStep && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            {(() => {
              const step = steps.find(s => s.id === selectedStep)
              if (!step) return null
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">{step.title}</h3>
                    <Badge className={`${getTypeColor(step.type)} text-white`}>
                      {step.type}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-4 h-4 mr-2" />
                        Estimated Time: {step.estimatedHours} hours
                      </div>
                      
                      {step.score && (
                        <div className="flex items-center text-green-400">
                          <Star className="w-4 h-4 mr-2" />
                          Your Score: {step.score}%
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-300">
                        <Target className="w-4 h-4 mr-2" />
                        Position: Step {step.order} of {steps.length}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-gray-300">
                        Status: <span className={`font-medium ${
                          step.isCompleted ? 'text-green-400' :
                          step.isActive ? 'text-blue-400' :
                          step.isLocked ? 'text-gray-400' : 'text-yellow-400'
                        }`}>
                          {step.isCompleted ? 'Completed' :
                           step.isActive ? 'Active' :
                           step.isLocked ? 'Locked' : 'Available'}
                        </span>
                      </div>
                      
                      {step.prerequisites.length > 0 && (
                        <div className="text-gray-300">
                          Prerequisites: {step.prerequisites.length} required
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    {step.isCompleted ? (
                      <>
                        <Button className="bg-green-600 hover:bg-green-700">
                          Review Content
                        </Button>
                        <Button variant="outline">
                          Retake Assessment
                        </Button>
                      </>
                    ) : step.isActive ? (
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : !step.isLocked ? (
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Start Step
                      </Button>
                    ) : (
                      <Button disabled variant="outline">
                        Complete Prerequisites First
                      </Button>
                    )}
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}