import { signCertificate, verifyCertificateSignature } from '@/lib/certificate-signature'

const originalSigningKey = process.env.CERT_SIGNING_KEY

describe('course certificate signatures', () => {
  beforeEach(() => {
    process.env.CERT_SIGNING_KEY = 'test-certificate-signing-key'
  })

  afterAll(() => {
    if (originalSigningKey === undefined) delete process.env.CERT_SIGNING_KEY
    else process.env.CERT_SIGNING_KEY = originalSigningKey
  })

  it('accepts an untampered certificate evidence record', () => {
    const evidence = {
      userId: 'learner-1',
      courseId: 'course-1',
      certificateNumber: 'CERT-TEST',
      verificationToken: 'verification-token',
      bardData: '{}',
    }
    const digitalSignature = signCertificate(evidence, process.env.CERT_SIGNING_KEY!)

    expect(verifyCertificateSignature({ ...evidence, digitalSignature })).toBe(true)
  })

  it('rejects a certificate when its course or learner evidence is changed', () => {
    const evidence = {
      userId: 'learner-1',
      courseId: 'course-1',
      certificateNumber: 'CERT-TEST',
      verificationToken: 'verification-token',
      bardData: '{}',
    }
    const digitalSignature = signCertificate(evidence, process.env.CERT_SIGNING_KEY!)

    expect(verifyCertificateSignature({ ...evidence, courseId: 'course-2', digitalSignature })).toBe(false)
    expect(verifyCertificateSignature({ ...evidence, userId: 'learner-2', digitalSignature })).toBe(false)
  })
})
