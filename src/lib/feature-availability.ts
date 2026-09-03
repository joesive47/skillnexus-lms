// These routes previously advertised success while relying on demo/stub code.
// Re-enable through a reviewed code change after implementation and verification.
export const unavailableApiPrefixes = [
  '/api/enterprise', '/api/auth/sso', '/api/auth/webauthn', '/api/auth/2fa',
  '/api/security/mfa', '/api/ai/generate-course', '/api/live-classroom',
  '/api/chatbot/upload-simple', '/api/chatbot/test', '/api/chatbot/smart-convert',
  '/api/chatbot/import-json', '/api/chatbot/import', '/api/chatbot/generate-embeddings',
  '/api/chatbot/excel-import', '/api/chatbot/convert-rag', '/api/chatbot/bulk-convert'
]
export const unavailablePagePrefixes = ['/enterprise', '/live-classroom']
export const removedApiPrefixes = ['/api/debug', '/api/seed', '/api/seed-production', '/api/stats/seed', '/api/test-db', '/api/db-test', '/api/auth/debug-session']
export function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'))
}
