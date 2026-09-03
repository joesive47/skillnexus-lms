export const VIDEO_HEARTBEAT_SECONDS = 15
export const VIDEO_HEARTBEAT_MAX_ACTIVE_SECONDS = 20

export const videoPresenceViolations = [
  'PAGE_HIDDEN',
  'WINDOW_BLURRED',
  'PLAYBACK_RATE_CHANGED',
  'FORWARD_SEEK_BLOCKED',
] as const

export type VideoPresenceViolation = typeof videoPresenceViolations[number]

export type VideoProgressEvidence = {
  sessionId: string
  sequence: number
  activeSeconds: number
  visibility: 'visible' | 'hidden'
  playbackRate: number
  violation?: VideoPresenceViolation
}

export function validateVideoProgressEvidence(value: unknown): VideoProgressEvidence | null {
  if (!value || typeof value !== 'object') return null
  const item = value as Partial<VideoProgressEvidence>
  if (typeof item.sessionId !== 'string' || !/^[a-zA-Z0-9_-]{16,100}$/.test(item.sessionId)) return null
  if (!Number.isInteger(item.sequence) || Number(item.sequence) < 1 || Number(item.sequence) > 10_000_000) return null
  if (!Number.isFinite(item.activeSeconds) || Number(item.activeSeconds) < 0 || Number(item.activeSeconds) > VIDEO_HEARTBEAT_MAX_ACTIVE_SECONDS) return null
  if (!['visible', 'hidden'].includes(item.visibility || '')) return null
  if (!Number.isFinite(item.playbackRate) || Number(item.playbackRate) < 0.25 || Number(item.playbackRate) > 4) return null
  if (item.violation && !videoPresenceViolations.includes(item.violation)) return null
  return item as VideoProgressEvidence
}

export function creditedActiveSeconds(evidence: VideoProgressEvidence, serverAllowance: number) {
  if (evidence.playbackRate !== 1) return 0
  if (evidence.visibility !== 'visible' && !evidence.violation) return 0
  return Math.min(serverAllowance, evidence.activeSeconds + 1)
}
