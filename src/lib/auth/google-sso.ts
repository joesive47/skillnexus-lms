import { ssoConfig } from './sso-config'

export async function handleGoogleSSO(profile: any) {
  return {
    id: profile.id,
    email: profile.emails?.[0]?.value || profile.email,
    name: profile.displayName || profile.name,
    image: profile.photos?.[0]?.value || profile.picture,
    provider: 'google',
  }
}

export const googleProvider = {
  id: 'google',
  name: 'Google',
  type: 'oauth' as const,
  clientId: ssoConfig.google.clientId,
  clientSecret: ssoConfig.google.clientSecret,
  authorization: {
    params: {
      scope: 'openid email profile',
    },
  },
}
