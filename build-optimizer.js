#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 SkillNexus Build Optimizer - Making your build lightning fast!');

// 1. Clean unnecessary files
const cleanFiles = () => {
  console.log('🧹 Cleaning unnecessary files...');
  
  const filesToRemove = [
    '.next',
    'node_modules/.cache',
    '*.tsbuildinfo',
    '.turbo',
    'temp',
    'cache',
    '.swc'
  ];
  
  filesToRemove.forEach(pattern => {
    try {
      execSync(`rimraf ${pattern}`, { stdio: 'ignore' });
    } catch (e) {
      // Ignore errors
    }
  });
  
  console.log('✅ Cleanup complete');
};

// 2. Optimize package.json
const optimizePackageJson = () => {
  console.log('📦 Optimizing package.json...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add build optimization scripts
  pkg.scripts = {
    ...pkg.scripts,
    'build:fast': 'cross-env SKIP_TYPE_CHECK=true SKIP_LINT=true next build',
    'build:ultra': 'npm run clean:cache && npm run build:fast',
    'clean:cache': 'rimraf .next node_modules/.cache .turbo .swc',
    'analyze': 'cross-env ANALYZE=true npm run build'
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  console.log('✅ Package.json optimized');
};

// 3. Create optimized Next.js config
const createOptimizedConfig = () => {
  console.log('⚙️ Creating optimized Next.js config...');
  
  const configContent = `const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ultra-fast build optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons', 
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu'
    ],
    bundlePagesRouterDependencies: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Skip checks for faster builds
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === 'true',
  },
  
  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }
    
    // Resolve aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), './src'),
    }
    
    // Ultra-aggressive bundle splitting
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000,
        maxSize: 25000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 25000,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: 'ui-components',
            chunks: 'all',
            maxSize: 20000,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            maxSize: 15000,
          },
        },
      }
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
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
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
  
  // Performance budgets
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig`;

  fs.writeFileSync(path.join(process.cwd(), 'next.config.optimized.js'), configContent);
  console.log('✅ Optimized config created');
};

// 4. Create ultra-fast build script
const createUltraFastBuild = () => {
  console.log('⚡ Creating ultra-fast build script...');
  
  const buildScript = `@echo off
echo 🚀 Ultra-Fast Build Starting...

REM Clean everything
echo 🧹 Cleaning cache...
if exist .next rmdir /s /q .next
if exist node_modules\\.cache rmdir /s /q node_modules\\.cache
if exist .turbo rmdir /s /q .turbo
if exist .swc rmdir /s /q .swc

REM Generate Prisma
echo 📊 Generating Prisma...
npx prisma generate

REM Ultra-fast build
echo ⚡ Building (Skip checks for speed)...
set SKIP_TYPE_CHECK=true
set SKIP_LINT=true
npm run build

echo ✅ Ultra-fast build complete!
pause`;

  fs.writeFileSync(path.join(process.cwd(), 'ultra-fast-build.bat'), buildScript);
  console.log('✅ Ultra-fast build script created');
};

// 5. Optimize TypeScript config
const optimizeTsConfig = () => {
  console.log('📝 Optimizing TypeScript config...');
  
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
  
  // Add performance optimizations
  tsConfig.compilerOptions = {
    ...tsConfig.compilerOptions,
    incremental: true,
    tsBuildInfoFile: '.next/cache/tsconfig.tsbuildinfo',
    skipLibCheck: true,
    skipDefaultLibCheck: true,
  };
  
  // Exclude more files for faster builds
  tsConfig.exclude = [
    ...tsConfig.exclude,
    'scripts/**/*',
    'docs/**/*',
    '**/*.md',
    'public/uploads/**/*',
    '.next/**/*',
    'node_modules/**/*'
  ];
  
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
  console.log('✅ TypeScript config optimized');
};

// 6. Create build performance monitor
const createBuildMonitor = () => {
  console.log('📊 Creating build performance monitor...');
  
  const monitorScript = `const { performance } = require('perf_hooks');
const fs = require('fs');

const startTime = performance.now();

console.log('📊 Build Performance Monitor');
console.log('⏱️  Build started at:', new Date().toISOString());

process.on('exit', () => {
  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  const stats = {
    buildTime: duration + 's',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  };
  
  console.log('✅ Build completed in:', duration + 's');
  
  fs.writeFileSync('.next/build-stats.json', JSON.stringify(stats, null, 2));
});`;

  fs.writeFileSync(path.join(process.cwd(), 'build-monitor.js'), monitorScript);
  console.log('✅ Build monitor created');
};

// 7. Update .vercelignore for lighter deployments
const optimizeVercelIgnore = () => {
  console.log('🚀 Optimizing Vercel deployment...');
  
  const vercelIgnoreContent = `# Development files
__tests__/
*.test.ts
*.test.js
*.spec.ts
*.spec.js
jest.config.js

# Documentation (keep only README)
*.md
!README.md
docs/
QUICK-*.md
PHASE*.md

# Scripts (keep only essential)
scripts/
!scripts/essential/

# Large files
public/uploads/
public/scorm-packages/
*.zip
*.tar.gz

# Development configs
.env.example
.env.postgresql.example
docker-compose.yml
Dockerfile*

# Cache and build artifacts
.next/cache/
.swc/
.turbo/
*.log
*.tmp
temp/
cache/
*.tsbuildinfo

# IDE
.vscode/
.idea/

# Backup files
*.backup
*.bak`;

  fs.writeFileSync(path.join(process.cwd(), '.vercelignore'), vercelIgnoreContent);
  console.log('✅ Vercel ignore optimized');
};

// Main execution
const main = () => {
  try {
    cleanFiles();
    optimizePackageJson();
    createOptimizedConfig();
    createUltraFastBuild();
    optimizeTsConfig();
    createBuildMonitor();
    optimizeVercelIgnore();
    
    console.log('\n🎉 Build optimization complete!');
    console.log('\n📋 Available commands:');
    console.log('  npm run build:fast    - Fast build (skip checks)');
    console.log('  npm run build:ultra   - Ultra-fast build');
    console.log('  npm run clean:cache   - Clean all cache');
    console.log('  npm run analyze       - Analyze bundle size');
    console.log('  ultra-fast-build.bat  - Windows ultra-fast build');
    
    console.log('\n⚡ Your project is now optimized for lightning-fast builds!');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { main };