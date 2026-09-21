export const ANALYTICS_RANGES = [7, 30, 90] as const

export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number]

export type DailyTrendPoint = {
  date: string
  label: string
  enrollments: number
  completions: number
  activities: number
}

export type LearningAnalyticsPayload = {
  rangeDays: AnalyticsRange
  lastUpdated: string
  metrics: {
    totalLearners: number
    activeLearners: number
    publishedCourses: number
    enrollments: number
    completionRate: number
    certificatesIssued: number
    atRiskLearners: number
  }
  trend: DailyTrendPoint[]
  categoryPerformance: Array<{
    name: string
    enrollments: number
    completions: number
    averageProgress: number
  }>
  courseFocus: Array<{
    id: string
    title: string
    enrollments: number
    completions: number
    averageProgress: number
  }>
  insights: {
    peakDay: string | null
    topCategory: string | null
  }
}

export function parseAnalyticsRange(value: string | null): AnalyticsRange {
  const parsed = Number(value)
  return ANALYTICS_RANGES.includes(parsed as AnalyticsRange) ? (parsed as AnalyticsRange) : 30
}

export function percentage(numerator: number, denominator: number) {
  if (denominator === 0) return 0
  return Math.min(100, Math.max(0, Math.round((numerator / denominator) * 100)))
}

export function dayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)
}

export function buildDailyTrend(
  days: AnalyticsRange,
  now: Date,
  records: { enrollments: Date[]; completions: Date[]; activities: Date[] }
): DailyTrendPoint[] {
  const buckets = new Map<string, DailyTrendPoint>()
  const firstDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  firstDay.setUTCDate(firstDay.getUTCDate() - days + 1)

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(firstDay)
    date.setUTCDate(firstDay.getUTCDate() + offset)
    const key = dayKey(date)
    buckets.set(key, { date: key, label: dayLabel(date), enrollments: 0, completions: 0, activities: 0 })
  }

  for (const date of records.enrollments) {
    const bucket = buckets.get(dayKey(date))
    if (bucket) bucket.enrollments += 1
  }
  for (const date of records.completions) {
    const bucket = buckets.get(dayKey(date))
    if (bucket) bucket.completions += 1
  }
  for (const date of records.activities) {
    const bucket = buckets.get(dayKey(date))
    if (bucket) bucket.activities += 1
  }

  return [...buckets.values()]
}
