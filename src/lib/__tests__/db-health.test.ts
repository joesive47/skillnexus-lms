/** @jest-environment node */

jest.mock('@/lib/prisma', () => {
  const prisma = { $connect: jest.fn(), $queryRaw: jest.fn() }
  return { __esModule: true, prisma, default: prisma }
})

import { checkDatabaseHealth, isDatabaseAvailable } from '@/lib/db-health'
import { prisma } from '@/lib/prisma'

const mockPrisma = prisma as unknown as {
  $connect: jest.Mock
  $queryRaw: jest.Mock
}

describe('database health checks', () => {
  const originalNow = Date.now

  beforeEach(() => {
    mockPrisma.$connect.mockReset().mockResolvedValue(undefined)
    mockPrisma.$queryRaw.mockReset().mockResolvedValue([{ '?column?': 1 }])
    delete process.env.DATABASE_HEALTHY_QUERY_LATENCY_MS
    delete process.env.DATABASE_DEGRADED_QUERY_LATENCY_MS
    delete process.env.DATABASE_HEALTH_CHECK_TIMEOUT_MS
  })

  afterEach(() => {
    Date.now = originalNow
  })

  it('does not mark a healthy steady-state query as degraded solely because cold startup was slow', async () => {
    const times = [0, 700, 1230, 1260]
    Date.now = jest.fn(() => times.shift() ?? 1260)

    await expect(checkDatabaseHealth()).resolves.toMatchObject({
      status: 'healthy',
      latency: 30,
      details: {
        connectionLatencyMs: 700,
        initialQueryLatencyMs: 530,
        queryLatencyMs: 30,
        totalLatencyMs: 1260,
      },
    })
  })

  it('reports degraded and unhealthy query latency using explicit thresholds', async () => {
    process.env.DATABASE_HEALTHY_QUERY_LATENCY_MS = '50'
    process.env.DATABASE_DEGRADED_QUERY_LATENCY_MS = '200'

    let times = [0, 10, 20, 160]
    Date.now = jest.fn(() => times.shift() ?? 160)
    await expect(checkDatabaseHealth()).resolves.toMatchObject({ status: 'degraded', latency: 140 })

    times = [0, 10, 20, 260]
    Date.now = jest.fn(() => times.shift() ?? 260)
    await expect(checkDatabaseHealth()).resolves.toMatchObject({ status: 'unhealthy', latency: 240 })
  })

  it('reports connection failures and keeps availability false', async () => {
    mockPrisma.$connect.mockRejectedValueOnce(new Error('connection refused')).mockRejectedValueOnce(new Error('connection refused'))

    await expect(checkDatabaseHealth()).resolves.toMatchObject({
      status: 'unhealthy',
      message: expect.stringContaining('connection refused'),
    })
    await expect(isDatabaseAvailable()).resolves.toBe(false)
  })
})
