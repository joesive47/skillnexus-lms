const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker optimization - เฉพาะ production
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  
  // Server Actions configuration - แก้ไข Body Size Limit
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb' // เพิ่มเป็น 50MB
    }
  },
  
  // Minimal config for stability
  serverExternalPackages: ['pdf-parse', '@napi-rs/canvas', 'canvas'],
  
  // Handle optional dependencies
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'pdf-parse': false,
        '@napi-rs/canvas': false,
        'canvas': false
      }
    }
    
    return config
  },
  
  // Basic settings
  poweredByHeader: false,
  compress: true,
  
  // Development settings
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 5,
    }
  }),
  
  // Docker-specific settings - เฉพาะ production
  ...(process.env.NODE_ENV === 'production' && {
    outputFileTracingRoot: process.cwd(),
  })
}

// Wrap with Sentry configuration
module.exports = withSentryConfig(
  nextConfig,
  {
    // Sentry Webpack Plugin Options
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // Upload source maps to Sentry
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
  }
)
