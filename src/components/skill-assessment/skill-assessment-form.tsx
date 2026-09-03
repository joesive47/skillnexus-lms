'use client'

import { useState } from "react"
import { updateSkillLevel } from "@/app/actions/skills"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface Skill {
  id: string
  name: string
  description?: string
  currentLevel: number
}

interface SkillAssessmentFormProps {
  skills: Skill[]
}

export function SkillAssessmentForm({ skills: initialSkills }: SkillAssessmentFormProps) {
  const [skills, setSkills] = useState(initialSkills)
  const [saving, setSaving] = useState(false)

  const updateSkill = async (skillId: string, level: number) => {
    setSaving(true)
    const result = await updateSkillLevel(skillId, level)
    
    if (result.success) {
      setSkills(prev => prev.map(s => 
        s.id === skillId ? { ...s, currentLevel: level } : s
      ))
      toast.success("อัปเดตระดับทักษะแล้ว")
    }
    setSaving(false)
  }

  const levels = [
    { value: 0, label: "ไม่มีประสบการณ์" },
    { value: 25, label: "เริ่มต้น" },
    { value: 50, label: "ปานกลาง" },
    { value: 75, label: "ดี" },
    { value: 100, label: "เชี่ยวชาญ" }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {skills.map((skill) => (
        <Card key={skill.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {skill.name}
              <span className="text-sm text-muted-foreground">
                {skill.currentLevel}%
              </span>
            </CardTitle>
            {skill.description && (
              <p className="text-sm text-muted-foreground">{skill.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={skill.currentLevel} className="h-2" />
            
            <div className="grid grid-cols-5 gap-2">
              {levels.map((level) => (
                <Button
                  key={level.value}
                  variant={skill.currentLevel === level.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSkill(skill.id, level.value)}
                  disabled={saving}
                  className="text-xs p-2 h-auto"
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}