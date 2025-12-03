// WebAuthn (Biometric Authentication)
import crypto from 'crypto'

export class WebAuthn {
  static generateChallenge(): string {
    return crypto.randomBytes(32).toString('base64url')
  }

  static createRegistrationOptions(userId: string, userName: string, userEmail: string) {
    const challenge = this.generateChallenge()
    
    return {
      challenge,
      rp: {
        name: 'SkillNexus LMS',
        id: process.env.NEXT_PUBLIC_DOMAIN || 'localhost'
      },
      user: {
        id: Buffer.from(userId).toString('base64url'),
        name: userEmail,
        displayName: userName
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },  // ES256
        { type: 'public-key', alg: -257 } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        requireResidentKey: false,
        userVerification: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    }
  }

  static createAuthenticationOptions(challenge?: string) {
    return {
      challenge: challenge || this.generateChallenge(),
      timeout: 60000,
      userVerification: 'preferred',
      rpId: process.env.NEXT_PUBLIC_DOMAIN || 'localhost'
    }
  }

  static verifyRegistration(credential: any, challenge: string): boolean {
    // Simplified verification - in production use @simplewebauthn/server
    return credential && credential.response && challenge.length > 0
  }

  static verifyAuthentication(credential: any, challenge: string): boolean {
    // Simplified verification - in production use @simplewebauthn/server
    return credential && credential.response && challenge.length > 0
  }
}
