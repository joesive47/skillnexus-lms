import { sanitizeInput, validateFileUpload, generateCSRFToken } from '@/lib/security'

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      expect(sanitizeInput(input)).toBe('Hello')
    })

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")'
      expect(sanitizeInput(input)).toBe('alert("xss")')
    })

    it('should remove event handlers', () => {
      const input = '<div onclick="alert()">Test</div>'
      expect(sanitizeInput(input)).toBe('<div>Test</div>')
    })
  })

  describe('validateFileUpload', () => {
    it('should accept valid image files', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const result = validateFileUpload(file)
      expect(result.valid).toBe(true)
    })

    it('should reject invalid file types', () => {
      const file = new File([''], 'test.exe', { type: 'application/exe' })
      const result = validateFileUpload(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid file type')
    })
  })

  describe('generateCSRFToken', () => {
    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken()
      const token2 = generateCSRFToken()
      expect(token1).not.toBe(token2)
      expect(token1).toHaveLength(64)
    })
  })
})