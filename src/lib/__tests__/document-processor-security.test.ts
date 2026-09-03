jest.mock('mammoth', () => ({ extractRawText: jest.fn() }))
jest.mock('xlsx', () => ({ read: jest.fn(), utils: { sheet_to_json: jest.fn() } }))
jest.mock('pdf-parse', () => jest.fn())
jest.mock('@/lib/rag-service', () => ({ splitTextIntoChunks: jest.fn(), generateEmbedding: jest.fn() }))
jest.mock('@/lib/prisma', () => ({}))

import { assertSafeRemoteUrl, isPrivateAddress } from '@/lib/document-processor'

describe('remote document URL security', () => {
  test.each([
    '127.0.0.1',
    '10.0.0.1',
    '172.16.0.1',
    '192.168.1.1',
    '169.254.169.254',
    '::1',
    'fc00::1',
    '::ffff:127.0.0.1',
  ])('blocks private or local address %s', address => {
    expect(isPrivateAddress(address)).toBe(true)
  })

  test('allows a public address', () => {
    expect(isPrivateAddress('8.8.8.8')).toBe(false)
  })

  test.each([
    'file:///etc/passwd',
    'http://localhost/internal',
    'http://127.0.0.1/admin',
    'https://user:password@example.com/private',
  ])('rejects unsafe URL %s', async url => {
    await expect(assertSafeRemoteUrl(url)).rejects.toThrow()
  })
})
