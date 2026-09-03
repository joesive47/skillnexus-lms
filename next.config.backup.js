const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations that work reliably
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Safe experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // External packages
  serverExternalPackages: ['pdf-parse', '@napi-rs/canvas', 'canvas'],

  // Build optimizations
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === 'true',
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Resolve aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), './src'),
    }
    
    // Handle optional dependencies
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        '@napi-rs/canvas': 'commonjs @napi-rs/canvas',
        'canvas': 'commonjs canvas'
      })
    } else {
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
  
  // Image optimization
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  // Output settings
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig