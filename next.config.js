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
  serverExternalPackages: [
    'pdf-parse', 
    '@napi-rs/canvas', 
    'canvas',
    'onnxruntime-node',
    '@xenova/transformers',
    'sharp'
  ],
  
  // Handle optional dependencies
  webpack: (config, { isServer }) => {
    // Ignore .node files (native bindings)
    config.module.rules.push({
      test: /\.node$/,
      type: 'asset/resource',
    })
    
    // Externalize onnxruntime for server
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node',
      })
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'pdf-parse': false,
        '@napi-rs/canvas': false,
        'canvas': false,
        'onnxruntime-node': false,
        '@xenova/transformers': false,
      }
    }
    
    // Ignore warnings
    config.ignoreWarnings = [
      { module: /node_modules\/canvas/ },
      { module: /node_modules\/@napi-rs\/canvas/ },
      { module: /node_modules\/onnxruntime-node/ },
      { module: /node_modules\/@xenova\/transformers/ },
    ]
    
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

// Conditionally wrap with Sentry if enabled
let finalConfig = nextConfig

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  try {
    const { withSentryConfig } = require('@sentry/nextjs')
    finalConfig = withSentryConfig(
      nextConfig,
      {
        silent: true,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
      },
      {
        widenClientFileUpload: true,
        transpileClientSDK: true,
        tunnelRoute: '/monitoring',
        hideSourceMaps: true,
        disableLogger: true,
      }
    )
  } catch (error) {
    console.log('Sentry configuration skipped')
  }
}

module.exports = finalConfig
