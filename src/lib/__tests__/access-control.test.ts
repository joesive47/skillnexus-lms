/** @jest-environment node */
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { requireSelfOrAdmin } from '@/lib/access-control'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: { user: { findUnique: jest.fn() } }
}))

const mockedAuth = auth as jest.Mock
const findUser = prisma.user.findUnique as jest.Mock

beforeEach(() => jest.clearAllMocks())

it('allows a learner to access their own resource', async () => {
  mockedAuth.mockResolvedValue({ user: { id: 'learner' } })
  findUser.mockResolvedValue({ id: 'learner', role: 'STUDENT', email: 'learner@test.local' })

  await expect(requireSelfOrAdmin('learner')).resolves.toMatchObject({ id: 'learner' })
})

it('allows an administrator to inspect a learner resource', async () => {
  mockedAuth.mockResolvedValue({ user: { id: 'admin' } })
  findUser.mockResolvedValue({ id: 'admin', role: 'ADMIN', email: 'admin@test.local' })

  await expect(requireSelfOrAdmin('learner')).resolves.toMatchObject({ role: 'ADMIN' })
})

it('rejects cross-account learner access', async () => {
  mockedAuth.mockResolvedValue({ user: { id: 'attacker' } })
  findUser.mockResolvedValue({ id: 'attacker', role: 'STUDENT', email: 'attacker@test.local' })

  await expect(requireSelfOrAdmin('victim')).rejects.toMatchObject({ status: 403 })
})

it('rejects unauthenticated access', async () => {
  mockedAuth.mockResolvedValue(null)

  await expect(requireSelfOrAdmin('victim')).rejects.toMatchObject({ status: 401 })
})
