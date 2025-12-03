'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, FileText } from 'lucide-react'

interface Event {
  id: string
  title: string
  type: 'class' | 'assignment' | 'exam' | 'webinar'
  date: string
  time: string
  course: string
  color: string
}

const sampleEvents: Event[] = [
  { id: '1', title: 'React Hooks Lecture', type: 'class', date: '2025-01-22', time: '10:00 AM', course: 'React 18', color: 'bg-blue-500' },
  { id: '2', title: 'TypeScript Assignment Due', type: 'assignment', date: '2025-01-25', time: '11:59 PM', course: 'TypeScript', color: 'bg-orange-500' },
  { id: '3', title: 'Node.js Exam', type: 'exam', date: '2025-01-28', time: '2:00 PM', course: 'Node.js', color: 'bg-red-500' },
  { id: '4', title: 'Live Webinar', type: 'webinar', date: '2025-01-30', time: '3:00 PM', course: 'Full Stack', color: 'bg-purple-500' }
]

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events] = useState(sampleEvents)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'class': return <Video className="w-3 h-3" />
      case 'assignment': return <FileText className="w-3 h-3" />
      case 'exam': return <FileText className="w-3 h-3" />
      case 'webinar': return <Video className="w-3 h-3" />
      default: return <CalendarIcon className="w-3 h-3" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">📅 Calendar</h1>
        <p className="text-slate-700 font-medium">Your schedule and upcoming events</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-white shadow-lg border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex space-x-2">
                <Button onClick={prevMonth} variant="outline" size="sm" className="border-slate-300">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button onClick={nextMonth} variant="outline" size="sm" className="border-slate-300">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold text-slate-700 text-sm py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayEvents = getEventsForDate(day)
                const isToday = day === new Date().getDate() && 
                               currentDate.getMonth() === new Date().getMonth() &&
                               currentDate.getFullYear() === new Date().getFullYear()
                
                return (
                  <div
                    key={day}
                    className={`aspect-square border-2 rounded-lg p-1 ${
                      isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    } cursor-pointer transition-colors`}
                  >
                    <div className={`text-sm font-bold ${isToday ? 'text-blue-700' : 'text-slate-900'}`}>
                      {day}
                    </div>
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div key={event.id} className={`${event.color} text-white text-xs px-1 py-0.5 rounded flex items-center space-x-1`}>
                          {getEventIcon(event.type)}
                          <span className="truncate">{event.title.slice(0, 8)}</span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-slate-600 font-semibold">+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`${event.color} text-white p-2 rounded-lg`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">{event.title}</h4>
                      <p className="text-xs text-slate-600 font-medium">{event.course}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-slate-100 text-slate-800 border-0 text-xs font-bold">
                          {new Date(event.date).toLocaleDateString()}
                        </Badge>
                        <span className="text-xs text-slate-600 font-medium">{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}