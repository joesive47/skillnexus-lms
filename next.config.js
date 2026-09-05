/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',

  // Standalone output สำหรับ production (Docker / Vercel)
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),

  // TypeScript & ESLint — strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Performance: Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.uppowerskill.com' },
      { protocol: 'https', hostname: 'pub-*.r2.dev' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // Performance: HTTP headers caching
  headers: async () => [
    {
      source: '/_next/static/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/favicon.ico',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
    },
    {
      source: '/(.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.svg)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
    },
  ],

  // Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // External packages (native modules ที่ต้องการ Node.js)
  serverExternalPackages: [
    'pdf-parse',
    '@napi-rs/canvas',
    'canvas',
    'onnxruntime-node',
    '@xenova/transformers',
    'sharp',
  ],

  // Webpack
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('onnxruntime-node', 'canvas', '@napi-rs/canvas', 'pdf-parse')
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, net: false, tls: false, crypto: false,
        'pdf-parse': false, '@napi-rs/canvas': false,
        'canvas': false, 'onnxruntime-node': false,
        '@xenova/transformers': false,
      }
    }
    config.ignoreWarnings = [
      { module: /node_modules\/canvas/ },
      { module: /node_modules\/@napi-rs\/canvas/ },
      { module: /node_modules\/onnxruntime-node/ },
      { module: /node_modules\/@xenova\/transformers/ },
    ]
    return config
  },

  // General
  poweredByHeader: false,
  compress: true,

  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: { maxInactiveAge: 60 * 1000, pagesBufferLength: 5 },
  }),
  ...(process.env.NODE_ENV === 'production' && {
    outputFileTracingRoot: process.cwd(),
  }),
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
