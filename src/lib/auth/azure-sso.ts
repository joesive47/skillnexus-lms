import { ssoConfig } from './sso-config'

export async function handleAzureSSO(profile: any) {
  return {
    id: profile.oid || profile.sub,
    email: profile.email || profile.preferred_username,
    name: profile.name,
    image: null,
    provider: 'azure',
  }
}

export const azureProvider = {
  id: 'azure-ad',
  name: 'Azure AD',
  type: 'oauth' as const,
  clientId: ssoConfig.azure.clientId,
  clientSecret: ssoConfig.azure.clientSecret,
  tenantId: ssoConfig.azure.tenantId,
  authorization: {
    url: `https://login.microsoftonline.com/${ssoConfig.azure.tenantId}/oauth2/v2.0/authorize`,
    params: {
      scope: 'openid email profile',
    },
  },
  token: `https://login.microsoftonline.com/${ssoConfig.azure.tenantId}/oauth2/v2.0/token`,
  userinfo: 'https://graph.microsoft.com/v1.0/me',
}
