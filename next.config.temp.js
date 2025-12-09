import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingExcludes: {
    '*': ['node_modules/@swc/core-linux-x64-gnu', 'node_modules/@swc/core-linux-x64-musl'],
  },
  serverExternalPackages: ['@xenova/transformers', 'pdf-parse', 'mammoth'],
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'skillnexus-videos.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  },
}

export default nextConfig