import { redirect } from 'next/navigation'

export default function LegacyTeacherCreateCoursePage() {
  redirect('/instructor/courses/new')
}
