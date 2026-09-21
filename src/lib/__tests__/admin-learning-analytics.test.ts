import { buildDailyTrend, parseAnalyticsRange, percentage } from '@/lib/admin-learning-analytics'

describe('admin learning analytics helpers', () => {
  it('accepts only supported date ranges', () => {
    expect(parseAnalyticsRange('7')).toBe(7)
    expect(parseAnalyticsRange('90')).toBe(90)
    expect(parseAnalyticsRange('31')).toBe(30)
    expect(parseAnalyticsRange(null)).toBe(30)
  })

  it('creates complete daily buckets and counts only dates in range', () => {
    const trend = buildDailyTrend(7, new Date('2026-09-21T12:00:00.000Z'), {
      enrollments: [new Date('2026-09-21T08:00:00.000Z'), new Date('2026-09-15T23:00:00.000Z')],
      completions: [new Date('2026-09-20T08:00:00.000Z')],
      activities: [new Date('2026-09-20T08:00:00.000Z'), new Date('2026-09-20T09:00:00.000Z')],
    })

    expect(trend).toHaveLength(7)
    expect(trend.at(-1)).toMatchObject({ date: '2026-09-21', enrollments: 1 })
    expect(trend.find((item) => item.date === '2026-09-20')).toMatchObject({ completions: 1, activities: 2 })
    expect(trend.reduce((sum, item) => sum + item.enrollments, 0)).toBe(2)
  })

  it('keeps percentages meaningful for empty and valid denominators', () => {
    expect(percentage(5, 0)).toBe(0)
    expect(percentage(2, 3)).toBe(67)
    expect(percentage(12, 10)).toBe(100)
  })
})
