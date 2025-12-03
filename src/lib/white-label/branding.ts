export interface BrandingConfig {
  organizationId: string
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  favicon: string
  customDomain?: string
}

const brandingCache = new Map<string, BrandingConfig>()

export async function getBranding(domain: string): Promise<BrandingConfig | null> {
  if (brandingCache.has(domain)) {
    return brandingCache.get(domain)!
  }
  
  const branding = await fetchBrandingFromDB(domain)
  if (branding) {
    brandingCache.set(domain, branding)
  }
  
  return branding
}

async function fetchBrandingFromDB(domain: string) {
  // Implement database fetch
  return null
}

export function getDefaultBranding(): BrandingConfig {
  return {
    organizationId: 'default',
    name: 'SkillNexus LMS',
    logo: '/logo.png',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    favicon: '/favicon.ico',
  }
}

export function applyBranding(config: BrandingConfig) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--primary-color', config.primaryColor)
    document.documentElement.style.setProperty('--secondary-color', config.secondaryColor)
    
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) favicon.href = config.favicon
    
    document.title = config.name
  }
}
