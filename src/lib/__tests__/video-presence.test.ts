import { creditedActiveSeconds, validateVideoProgressEvidence } from '@/lib/video-presence'

const validEvidence = {
  sessionId: '12345678-1234-1234-1234-123456789012',
  sequence: 1,
  activeSeconds: 15,
  visibility: 'visible' as const,
  playbackRate: 1,
}

describe('secure video presence evidence', () => {
  it('accepts a bounded visible 1x heartbeat', () => {
    expect(validateVideoProgressEvidence(validEvidence)).toEqual(validEvidence)
    expect(creditedActiveSeconds(validEvidence, 12)).toBe(12)
  })

  it('does not credit accelerated playback', () => {
    expect(creditedActiveSeconds({ ...validEvidence, playbackRate: 2 }, 15)).toBe(0)
  })

  it('does not credit a hidden heartbeat without a presence event', () => {
    expect(creditedActiveSeconds({ ...validEvidence, visibility: 'hidden' }, 15)).toBe(0)
  })

  it('rejects oversized active time and invalid sequences', () => {
    expect(validateVideoProgressEvidence({ ...validEvidence, activeSeconds: 60 })).toBeNull()
    expect(validateVideoProgressEvidence({ ...validEvidence, sequence: 0 })).toBeNull()
  })
})
