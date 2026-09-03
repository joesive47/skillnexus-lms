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
    const existing = await tx.certificate.findUnique({ where: { userId_courseId: { userId, courseId } },
      include: { course: { select: { title: true } }, user: { select: { name: true, email: true } } } })
    if (existing) return existing
    const verificationToken = randomBytes(24).toString('hex')
    const certificateNumber = `CERT-${randomBytes(12).toString('hex').toUpperCase()}`
    const evidence = { userId, courseId, certificateNumber, verificationToken, bardData }
    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.AUTH_URL || 'http://127.0.0.1:3001'
    const qrCodeUrl = await QRCode.toDataURL(`${baseUrl}/api/bard-certificates/verify/${verificationToken}`)
    const certificate = await tx.certificate.create({ data: { userId, courseId, certificateNumber, verificationToken, bardData, qrCodeUrl,
      digitalSignature: signCertificate(evidence, signingKey) },
      include: { course: { select: { title: true } }, user: { select: { name: true, email: true } } } })
    await tx.certificationEvent.create({ data: { eventType: 'CERTIFICATE_ISSUED', userId,
      entityType: 'CERTIFICATE', entityId: certificate.id, metadata: JSON.stringify({ courseId, certificateNumber }) } })
    return certificate
  })
}
