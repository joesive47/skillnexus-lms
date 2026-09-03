// Gamification Service - ไม่กระทบระบบเดิม
import { isFeatureEnabled } from './feature-flags'

export async function awardPoints(
  userId: string, 
  points: number, 
  source: string, 
  sourceId?: string
) {
  // Check feature flag first
  if (!(await isFeatureEnabled('gamification'))) {
    return null // Silent fail if disabled
  }

  try {
    // Gamification system not fully implemented yet
    // This is a placeholder for future implementation
    console.log(`User ${userId} earned ${points} points from ${source}`)
    return { points, source }
  } catch (error) {
    console.error('Gamification error:', error)
    return null // Don't break main flow
  }
}