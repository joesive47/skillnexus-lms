const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for speed
  compiler: {
    removeConsole: false, // Keep console in dev
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Skip all checks in development
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  swcMinify: true,
  
  // Minimal webpack config
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      // Development optimizations
      config.optimization = {
        ...config.optimization,
        minimize: false,
        splitChunks: false,
      }
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), './src'),
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
