// SSO Configuration for Enterprise Authentication
export const ssoConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
  },
  
  azure: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
    tenantId: process.env.AZURE_TENANT_ID || 'common',
    callbackURL: `${process.env.NEXTAUTH_URL}/api/auth/callback/azure`,
  },
  
  saml: {
    entryPoint: process.env.SAML_ENTRY_POINT || '',
    issuer: process.env.SAML_ISSUER || 'skillnexus-lms',
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/saml`,
    cert: process.env.SAML_CERT || '',
  }
}

export const isSSOEnabled = {
  google: !!process.env.GOOGLE_CLIENT_ID,
  azure: !!process.env.AZURE_CLIENT_ID,
  saml: !!process.env.SAML_ENTRY_POINT,
}
