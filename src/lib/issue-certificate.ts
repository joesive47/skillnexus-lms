import { randomBytes } from 'crypto'
import { signCertificate } from '@/lib/certificate-signature'
import prisma from '@/lib/prisma'
import { AccessError, requireUser } from '@/lib/access-control'
import { requireCertificateEligibility } from '@/lib/learning-evidence'
import QRCode from 'qrcode'

export async function issueVerifiedCertificate(userId: string, courseId: string, bardData = '{}') {
  const actor = await requireUser()
  if (actor.id !== userId && actor.role !== 'ADMIN') throw new AccessError('Forbidden')
  await requireCertificateEligibility(userId, courseId)
  const signingKey = process.env.CERT_SIGNING_KEY || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (!signingKey) throw new AccessError('Certificate signing is not configured', 503)
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM users WHERE id = ${userId} FOR UPDATE`
    const baseUrl = (process.env.NEXT_PUBLIC_URL || process.env.AUTH_URL || 'https://www.uppowerskill.com').replace(/\/$/, '')
    const existing = await tx.certificate.findUnique({ where: { userId_courseId: { userId, courseId } },
      include: { course: { select: { title: true } }, user: { select: { name: true, email: true } } } })
    if (existing) {
      const qrCodeUrl = await QRCode.toDataURL(`${baseUrl}/certificates/verify/${existing.verificationToken}`)
      return tx.certificate.update({
        where: { id: existing.id },
        data: { qrCodeUrl },
        include: { course: { select: { title: true } }, user: { select: { name: true, email: true } } },
      })
    }
    const verificationToken = randomBytes(24).toString('hex')
    const certificateNumber = `CERT-${randomBytes(12).toString('hex').toUpperCase()}`
    const evidence = { userId, courseId, certificateNumber, verificationToken, bardData }
    // The QR code opens the public verifier for this signed course certificate,
    // not the unrelated BARD verification endpoint.
    const qrCodeUrl = await QRCode.toDataURL(`${baseUrl}/certificates/verify/${verificationToken}`)
    const certificate = await tx.certificate.create({ data: { userId, courseId, certificateNumber, verificationToken, bardData, qrCodeUrl,
      digitalSignature: signCertificate(evidence, signingKey) },
      include: { course: { select: { title: true } }, user: { select: { name: true, email: true } } } })
    await tx.certificationEvent.create({ data: { eventType: 'CERTIFICATE_ISSUED', userId,
      entityType: 'CERTIFICATE', entityId: certificate.id, metadata: JSON.stringify({ courseId, certificateNumber }) } })
    return certificate
  })
}

/**
 * Attempt automatic issuance after a learning event. A course without the
 * certificate option, or a course that is not yet complete, is not an error
 * for progress-saving endpoints.
 */
export async function issueCertificateOnCompletion(userId: string, courseId: string) {
  try {
    return await issueVerifiedCertificate(userId, courseId)
  } catch (error) {
    if (error instanceof AccessError && error.status === 409) return null
    throw error
  }
}
