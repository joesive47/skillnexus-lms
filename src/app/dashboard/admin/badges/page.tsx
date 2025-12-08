"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Plus, Edit, Trash2, Star, Trophy, Medal, Crown } from "lucide-react"

interface BadgeData {
  id: string
  name: string
  description: string
  icon: string
  color: string
  criteria: string
  points: number
  category: string
}

const badgeIcons = {
  star: Star,
  trophy: Trophy,
  medal: Medal,
  crown: Crown,
  award: Award
}

const badgeColors = [
  { name: "Gold", value: "bg-yellow-500", text: "text-yellow-100" },
  { name: "Silver", value: "bg-gray-400", text: "text-gray-100" },
  { name: "Bronze", value: "bg-orange-600", text: "text-orange-100" },
  { name: "Blue", value: "bg-blue-500", text: "text-blue-100" },
  { name: "Green", value: "bg-green-500", text: "text-green-100" },
  { name: "Purple", value: "bg-purple-500", text: "text-purple-100" },
  { name: "Red", value: "bg-red-500", text: "text-red-100" }
]

export default function BadgesManagement() {
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingBadge, setEditingBadge] = useState<BadgeData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "star",
    color: "bg-yellow-500",
    criteria: "",
    points: 10,
    category: "achievement"
  })

  useEffect(() => {
    // Load existing badges
    const savedBadges = localStorage.getItem('badges')
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges))
    } else {
      // Default badges
      const defaultBadges: BadgeData[] = [
        {
          id: "1",
          name: "First Course",
          description: "Complete your first course",
          icon: "star",
          color: "bg-yellow-500",
          criteria: "Complete 1 course",
          points: 10,
          category: "achievement"
        },
        {
          id: "2", 
          name: "Quiz Master",
          description: "Score 100% on 5 quizzes",
          icon: "trophy",
          color: "bg-blue-500",
          criteria: "Perfect score on 5 quizzes",
          points: 25,
          category: "skill"
        },
        {
          id: "3",
          name: "Learning Streak",
          description: "Learn for 7 consecutive days",
          icon: "medal",
          color: "bg-green-500", 
          criteria: "7 day learning streak",
          points: 20,
          category: "engagement"
        }
      ]
      setBadges(defaultBadges)
      localStorage.setItem('badges', JSON.stringify(defaultBadges))
    }
  }, [])

  const saveBadges = (newBadges: BadgeData[]) => {
    setBadges(newBadges)
    localStorage.setItem('badges', JSON.stringify(newBadges))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBadge) {
      // Update existing badge
      const updatedBadges = badges.map(badge => 
        badge.id === editingBadge.id 
          ? { ...formData, id: editingBadge.id }
          : badge
      )
      saveBadges(updatedBadges)
      setEditingBadge(null)
    } else {
      // Create new badge
      const newBadge: BadgeData = {
        ...formData,
        id: Date.now().toString()
      }
      saveBadges([...badges, newBadge])
    }
    
    setIsCreating(false)
    setFormData({
      name: "",
      description: "",
      icon: "star",
      color: "bg-yellow-500",
      criteria: "",
      points: 10,
      category: "achievement"
    })
  }

  const handleEdit = (badge: BadgeData) => {
    setFormData(badge)
    setEditingBadge(badge)
    setIsCreating(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this badge?")) {
      const updatedBadges = badges.filter(badge => badge.id !== id)
      saveBadges(updatedBadges)
    }
  }

  const renderBadgePreview = (badge: Partial<BadgeData>) => {
    const IconComponent = badgeIcons[badge.icon as keyof typeof badgeIcons] || Star
    const colorClass = badge.color || "bg-yellow-500"
    const textColor = badgeColors.find(c => c.value === colorClass)?.text || "text-yellow-100"
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${colorClass} ${textColor}`}>
        <IconComponent className="w-4 h-4" />
        <span className="text-sm font-medium">{badge.name || "Badge Name"}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Badge Management</h1>
          <p className="text-gray-600">Create and manage achievement badges</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Badge
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingBadge ? "Edit Badge" : "Create New Badge"}</CardTitle>
            <CardDescription>Design a new achievement badge for learners</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Badge Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Course Completion"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="points">Points Reward</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this badge represents"
                  required
                />
              </div>

              <div>
                <Label htmlFor="criteria">Earning Criteria</Label>
                <Textarea
                  id="criteria"
                  value={formData.criteria}
                  onChange={(e) => setFormData({...formData, criteria: e.target.value})}
                  placeholder="What must a learner do to earn this badge?"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(badgeIcons).map(([key, Icon]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData({...formData, color: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {badgeColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="skill">Skill</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Preview</Label>
                <div className="p-4 border rounded-lg bg-gray-50">
                  {renderBadgePreview(formData)}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingBadge ? "Update Badge" : "Create Badge"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false)
                    setEditingBadge(null)
                    setFormData({
                      name: "",
                      description: "",
                      icon: "star",
                      color: "bg-yellow-500",
                      criteria: "",
                      points: 10,
                      category: "achievement"
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => {
          const IconComponent = badgeIcons[badge.icon as keyof typeof badgeIcons] || Star
          const colorClass = badge.color
          const textColor = badgeColors.find(c => c.value === colorClass)?.text || "text-yellow-100"
          
          return (
            <Card key={badge.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-full ${colorClass} ${textColor}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(badge)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(badge.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{badge.name}</CardTitle>
                <CardDescription>{badge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-medium">{badge.points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <Badge variant="secondary">{badge.category}</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Criteria:</span>
                    <p className="mt-1 text-gray-800">{badge.criteria}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {badges.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No badges yet</h3>
            <p className="text-gray-600 mb-4">Create your first achievement badge to motivate learners</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Badge
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}