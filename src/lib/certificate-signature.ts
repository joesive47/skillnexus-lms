import { createHmac, timingSafeEqual } from 'crypto'

type Evidence = { userId: string; courseId: string; certificateNumber: string; verificationToken: string; bardData: string }
export function signCertificate(evidence: Evidence, key: string) {
  const { userId, courseId, certificateNumber, verificationToken, bardData } = evidence
  return 'v2:' + createHmac('sha256', key).update(JSON.stringify({ userId, courseId, certificateNumber, verificationToken, bardData })).digest('hex')
}
export function verifyCertificateSignature(evidence: Evidence & { digitalSignature: string }) {
  const key = process.env.CERT_SIGNING_KEY || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (!key) return false
  const expected = evidence.digitalSignature.startsWith('v2:') ? signCertificate(evidence, key) :
    // Legacy signatures are trusted only with an explicitly configured signing key.
    process.env.CERT_SIGNING_KEY ? createHmac('sha256', process.env.CERT_SIGNING_KEY).update(evidence.bardData).digest('hex') : ''
  const left = Buffer.from(expected)
  const right = Buffer.from(evidence.digitalSignature)
  return left.length > 0 && left.length === right.length && timingSafeEqual(left, right)
}
