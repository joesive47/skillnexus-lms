import { ssoConfig } from './sso-config'

export const samlStrategy = {
  entryPoint: ssoConfig.saml.entryPoint,
  issuer: ssoConfig.saml.issuer,
  callbackUrl: ssoConfig.saml.callbackUrl,
  cert: ssoConfig.saml.cert,
  identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
}

export async function handleSAMLProfile(profile: any) {
  return {
    id: profile.nameID || profile.email,
    email: profile.email || profile.nameID,
    name: profile.displayName || profile.name || profile.email,
    provider: 'saml',
  }
}

export function validateSAMLConfig() {
  if (!ssoConfig.saml.entryPoint) {
    throw new Error('SAML_ENTRY_POINT is required')
  }
  if (!ssoConfig.saml.cert) {
    throw new Error('SAML_CERT is required')
  }
  return true
}
