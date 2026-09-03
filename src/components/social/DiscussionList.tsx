'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Heart, Pin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Discussion {
  id: string
  title: string
  content: string
  pinned: boolean
  createdAt: string
  user: { name: string; image?: string }
  _count: { replies: number; likes: number }
}

interface DiscussionListProps {
  courseId: string
}

export function DiscussionList({ courseId }: DiscussionListProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Check if social features enabled
    fetch('/api/features/social_features')
      .then(res => res.json())
      .then(data => {
        setIsEnabled(data.enabled)
        if (data.enabled) {
          loadDiscussions()
        } else {
          setLoading(false)
        }
      })
      .catch(() => setLoading(false))
  }, [courseId])

  const loadDiscussions = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/discussions`)
      const data = await res.json()
      setDiscussions(data.discussions || [])
    } catch (error) {
      console.error('Failed to load discussions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isEnabled) return null
  if (loading) return <div className="p-4">Loading discussions...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Discussions</h3>
        <Button size="sm">New Discussion</Button>
      </div>

      {discussions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No discussions yet. Start the conversation!
          </CardContent>
        </Card>
      ) : (
        discussions.map((discussion) => (
          <Card key={discussion.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {discussion.pinned && (
                      <Pin className="w-4 h-4 text-blue-600" />
                    )}
                    <h4 className="font-medium">{discussion.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {discussion.content}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>by {discussion.user.name}</span>
                  <span>{formatDistanceToNow(new Date(discussion.createdAt))} ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {discussion._count.replies}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {discussion._count.likes}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}