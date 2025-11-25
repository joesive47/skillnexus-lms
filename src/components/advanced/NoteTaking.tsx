'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { StickyNote, Clock, Save, Trash2 } from 'lucide-react'

interface Note {
  id: string
  content: string
  timestamp?: number
  createdAt: string
}

interface NoteTakingProps {
  lessonId: string
  userId: string
  currentTime?: number
}

export function NoteTaking({ lessonId, userId, currentTime = 0 }: NoteTakingProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [isEnabled, setIsEnabled] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    checkFeatureAndLoad()
  }, [lessonId])

  const checkFeatureAndLoad = async () => {
    try {
      const featureRes = await fetch('/api/features/advanced_features')
      const featureData = await featureRes.json()
      
      if (featureData.enabled) {
        setIsEnabled(true)
        await loadNotes()
      }
    } catch (error) {
      console.error('Failed to check feature:', error)
    }
  }

  const loadNotes = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/notes`)
      const data = await res.json()
      setNotes(data.notes || [])
    } catch (error) {
      console.error('Failed to load notes:', error)
    }
  }

  const saveNote = async () => {
    if (!newNote.trim()) return

    setSaving(true)
    try {
      const res = await fetch(`/api/lessons/${lessonId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote,
          timestamp: currentTime > 0 ? Math.floor(currentTime) : null
        })
      })

      if (res.ok) {
        const note = await res.json()
        setNotes(prev => [note, ...prev])
        setNewNote('')
      }
    } catch (error) {
      console.error('Failed to save note:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' })
      setNotes(prev => prev.filter(n => n.id !== noteId))
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isEnabled) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-yellow-600" />
          <CardTitle className="text-lg">Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Take a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-between items-center">
            {currentTime > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTime(currentTime)}
              </div>
            )}
            <Button 
              size="sm" 
              onClick={saveNote}
              disabled={!newNote.trim() || saving}
            >
              <Save className="w-4 h-4 mr-1" />
              {saving ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No notes yet. Start taking notes to remember key points!
            </p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {note.timestamp && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(note.timestamp)}
                    </Badge>
                  )}
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}