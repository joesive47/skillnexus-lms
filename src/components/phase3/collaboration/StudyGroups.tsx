'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MessageCircle, Calendar, Search, Plus } from 'lucide-react'

interface StudyGroup {
  id: string
  name: string
  description?: string
  memberCount: number
  maxMembers: number
  availableSpots: number
  course?: { title: string }
  creator: { name: string }
  _count: {
    discussions: number
    sessions: number
  }
}

export default function StudyGroups() {
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([])
  const [publicGroups, setPublicGroups] = useState<StudyGroup[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyGroups()
    fetchPublicGroups()
  }, [])

  const fetchMyGroups = async () => {
    try {
      const res = await fetch('/api/phase3/collaboration?action=my-groups')
      const data = await res.json()
      setMyGroups(data)
    } catch (error) {
      console.error('Failed to fetch my groups:', error)
    }
  }

  const fetchPublicGroups = async () => {
    try {
      const res = await fetch(`/api/phase3/collaboration?action=search-groups&query=${searchQuery}`)
      const data = await res.json()
      setPublicGroups(data)
    } catch (error) {
      console.error('Failed to fetch public groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const joinGroup = async (groupId: string) => {
    try {
      const res = await fetch('/api/phase3/collaboration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join-group', groupId })
      })
      
      if (res.ok) {
        fetchMyGroups()
        fetchPublicGroups()
      }
    } catch (error) {
      console.error('Failed to join group:', error)
    }
  }

  const GroupCard = ({ group, showJoinButton = false }: { group: StudyGroup, showJoinButton?: boolean }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{group.description}</p>
          </div>
          {showJoinButton && (
            <Button 
              size="sm" 
              onClick={() => joinGroup(group.id)}
              disabled={group.availableSpots <= 0}
            >
              {group.availableSpots > 0 ? 'Join' : 'Full'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {group.course && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{group.course.title}</Badge>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{group.memberCount}/{group.maxMembers}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{group._count?.discussions || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{group._count?.sessions || 0}</span>
              </div>
            </div>
            <span className="text-gray-500">by {group.creator?.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return <div className="flex justify-center p-8">Loading study groups...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Groups</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <Tabs defaultValue="my-groups">
        <TabsList>
          <TabsTrigger value="my-groups">My Groups ({myGroups.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-4">
          {myGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Study Groups Yet</h3>
                <p className="text-gray-500 mb-4">Join or create a study group to collaborate with other learners</p>
                <Button>Create Your First Group</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search study groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchPublicGroups}>Search</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicGroups.map((group) => (
              <GroupCard key={group.id} group={group} showJoinButton />
            ))}
          </div>

          {publicGroups.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Groups Found</h3>
                <p className="text-gray-500">Try adjusting your search or create a new group</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}