import { validateImageFile } from '@/lib/upload'

function imageFile(bytes: number[], type: string, name = 'image.bin') {
  const content = Uint8Array.from(bytes)
  return {
    name,
    type,
    size: content.byteLength,
    slice: (start = 0, end = content.byteLength) => ({
      arrayBuffer: async () => content.slice(start, end).buffer,
    }),
  } as unknown as File
}

describe('image upload validation', () => {
  it('accepts a PNG with a valid signature', async () => {
    const file = imageFile([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0], 'image/png', 'ok.png')
    await expect(validateImageFile(file)).resolves.toBeUndefined()
  })

  it('rejects executable content disguised as an image', async () => {
    const file = imageFile([0x4d, 0x5a, 0x90, 0, 0, 0], 'image/png', 'malware.png')
    await expect(validateImageFile(file)).rejects.toThrow('does not match')
  })

  it('rejects SVG because it can contain active content', async () => {
    const file = imageFile([0x3c, 0x73, 0x76, 0x67, 0x3e], 'image/svg+xml', 'unsafe.svg')
    await expect(validateImageFile(file)).rejects.toThrow('Invalid file type')
  })
})
