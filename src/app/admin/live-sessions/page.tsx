'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Video, Plus, Play } from 'lucide-react'
import { InvitationManager } from '@/lib/streaming/invitation-manager'
import Link from 'next/link'

export default function LiveSessionsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventType: 'CLASS' as const,
    inviteeName: '',
    inviteeEmail: '',
    scheduledAt: '',
    duration: 60,
    message: ''
  })

  const handleCreate = async () => {
    const invitation = InvitationManager.createInvitation({
      ...formData,
      hostId: 'admin-id',
      hostName: 'Admin',
      scheduledAt: new Date(formData.scheduledAt),
      meetingLink: InvitationManager.generateLink('event-123', 'invitee-456')
    })

    await InvitationManager.sendInvitation(invitation)
    setShowCreate(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Live Sessions</h1>
        <div className="flex gap-2">
          <Link href="/live-classroom/meeting">
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" />
              Start Live
            </Button>
          </Link>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule Live Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Session Title"
              value={formData.eventTitle}
              onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
            />
            
            <select
              className="w-full p-2 border rounded"
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
            >
              <option value="CLASS">Live Class</option>
              <option value="MEETING">Meeting</option>
              <option value="DEMO">Demo</option>
              <option value="TUTORING">Tutoring</option>
            </select>

            <Input
              placeholder="Student Name"
              value={formData.inviteeName}
              onChange={(e) => setFormData({ ...formData, inviteeName: e.target.value })}
            />

            <Input
              placeholder="Student Email"
              type="email"
              value={formData.inviteeEmail}
              onChange={(e) => setFormData({ ...formData, inviteeEmail: e.target.value })}
            />

            <Input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            />

            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            />

            <Button onClick={handleCreate} className="w-full">
              Schedule & Send Invitation
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No scheduled sessions
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
