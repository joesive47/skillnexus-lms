// CDN Configuration for CloudFront/Cloudflare
export const cdnConfig = {
  cloudfront: {
    enabled: process.env.CDN_ENABLED === 'true',
    distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    domain: process.env.CLOUDFRONT_DOMAIN,
    
    // Cache behaviors
    cacheBehaviors: {
      static: {
        pathPattern: '/static/*',
        ttl: 31536000, // 1 year
        compress: true
      },
      images: {
        pathPattern: '/images/*',
        ttl: 86400, // 1 day
        compress: true
      },
      api: {
        pathPattern: '/api/*',
        ttl: 0, // No cache
        compress: false
      },
      videos: {
        pathPattern: '/videos/*',
        ttl: 604800, // 1 week
        compress: false
      }
    }
  },

  cloudflare: {
    enabled: process.env.CLOUDFLARE_ENABLED === 'true',
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    
    // Cache rules
    cacheRules: {
      browserTTL: 14400, // 4 hours
      edgeTTL: 7200, // 2 hours
      bypassCache: ['/api/auth/*', '/api/webhook/*']
    }
  },

  // Asset optimization
  optimization: {
    images: {
      formats: ['webp', 'avif', 'jpeg'],
      quality: 85,
      sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
    },
    videos: {
      formats: ['mp4', 'webm'],
      quality: 'auto',
      streaming: true
    }
  }
};

// CDN URL helper
export function getCDNUrl(path: string): string {
  if (cdnConfig.cloudfront.enabled && cdnConfig.cloudfront.domain) {
    return `https://${cdnConfig.cloudfront.domain}${path}`;
  }
  return path;
}

// Purge CDN cache
export async function purgeCDNCache(paths: string[]) {
  if (cdnConfig.cloudflare.enabled) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${cdnConfig.cloudflare.zoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cdnConfig.cloudflare.apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ files: paths })
        }
      );
      return await response.json();
    } catch (error) {
      console.error('CDN purge failed:', error);
      return null;
    }
  }
}
