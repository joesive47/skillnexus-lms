/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker optimization
  output: 'standalone',
  
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
  
  // Docker-specific settings
  outputFileTracingRoot: process.cwd(),
}

module.exports = nextConfig