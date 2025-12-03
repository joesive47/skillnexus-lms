import CalendarView from '@/components/calendar/CalendarView'

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <CalendarView />
    </div>
  )
}

export const metadata = {
  title: 'Calendar - SkillNexus LMS',
  description: 'Your learning schedule and upcoming events',
}