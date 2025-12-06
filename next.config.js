import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    outputFileTracingExcludes: {
      '*': ['node_modules/@swc/core-linux-x64-gnu', 'node_modules/@swc/core-linux-x64-musl'],
    },
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverComponentsExternalPackages: ['@xenova/transformers', 'pdf-parse', 'mammoth']
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
    NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
}

export default nextConfig
