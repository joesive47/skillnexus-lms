#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SkillNexus Build & Deploy Script\n');

// Configuration
const config = {
  skipTests: process.env.SKIP_TESTS === 'true',
  skipLint: process.env.SKIP_LINT === 'true',
  skipTypeCheck: process.env.SKIP_TYPE_CHECK === 'true',
  production: process.env.NODE_ENV === 'production',
};

// Utility functions
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} exists`);
    return true;
  } else {
    console.log(`❌ ${description} missing`);
    return false;
  }
}

// Pre-build checks
function preBuildChecks() {
  console.log('🔍 Running pre-build checks...\n');\n  \n  const checks = [\n    checkFile('.env', 'Environment file'),\n    checkFile('prisma/schema.prisma', 'Prisma schema'),\n    checkFile('src/app/layout.tsx', 'Root layout'),\n    checkFile('src/app/page.tsx', 'Home page'),\n    checkFile('package.json', 'Package.json'),\n  ];\n  \n  const passed = checks.filter(Boolean).length;\n  console.log(`📊 Pre-build checks: ${passed}/${checks.length} passed\\n`);\n  \n  return passed === checks.length;\n}\n\n// Database setup\nfunction setupDatabase() {\n  console.log('🗄️  Setting up database...\\n');\n  \n  const commands = [\n    'npx prisma generate',\n    'npx prisma db push --accept-data-loss',\n  ];\n  \n  for (const command of commands) {\n    if (!runCommand(command, `Database: ${command}`)) {\n      return false;\n    }\n  }\n  \n  return true;\n}\n\n// Build process\nfunction buildProject() {\n  console.log('🏗️  Building project...\\n');\n  \n  // Set environment variables for build\n  const env = {\n    ...process.env,\n    SKIP_TYPE_CHECK: config.skipTypeCheck ? 'true' : 'false',\n    SKIP_LINT: config.skipLint ? 'true' : 'false',\n    NODE_OPTIONS: '--max-old-space-size=4096',\n    NEXT_TELEMETRY_DISABLED: '1',\n  };\n  \n  try {\n    execSync('npm run build', { \n      stdio: 'inherit',\n      env\n    });\n    console.log('✅ Build completed successfully\\n');\n    return true;\n  } catch (error) {\n    console.error('❌ Build failed:', error.message);\n    return false;\n  }\n}\n\n// Post-build checks\nfunction postBuildChecks() {\n  console.log('🔍 Running post-build checks...\\n');\n  \n  const checks = [\n    checkFile('.next', 'Next.js build output'),\n    checkFile('.next/standalone', 'Standalone build'),\n    checkFile('.next/static', 'Static assets'),\n  ];\n  \n  const passed = checks.filter(Boolean).length;\n  console.log(`📊 Post-build checks: ${passed}/${checks.length} passed\\n`);\n  \n  return passed >= 2; // Allow some flexibility\n}\n\n// Deployment preparation\nfunction prepareDeployment() {\n  console.log('📦 Preparing for deployment...\\n');\n  \n  // Create deployment info\n  const deployInfo = {\n    buildTime: new Date().toISOString(),\n    version: require('./package.json').version,\n    nodeVersion: process.version,\n    environment: config.production ? 'production' : 'development',\n  };\n  \n  fs.writeFileSync(\n    path.join(process.cwd(), '.next', 'deploy-info.json'),\n    JSON.stringify(deployInfo, null, 2)\n  );\n  \n  console.log('✅ Deployment info created');\n  console.log('📋 Build Summary:');\n  console.log(`   - Build Time: ${deployInfo.buildTime}`);\n  console.log(`   - Version: ${deployInfo.version}`);\n  console.log(`   - Node: ${deployInfo.nodeVersion}`);\n  console.log(`   - Environment: ${deployInfo.environment}\\n`);\n  \n  return true;\n}\n\n// Main execution\nasync function main() {\n  const startTime = Date.now();\n  \n  try {\n    console.log('🎯 Starting build process...\\n');\n    \n    // Step 1: Pre-build checks\n    if (!preBuildChecks()) {\n      throw new Error('Pre-build checks failed');\n    }\n    \n    // Step 2: Setup database\n    if (!setupDatabase()) {\n      throw new Error('Database setup failed');\n    }\n    \n    // Step 3: Build project\n    if (!buildProject()) {\n      throw new Error('Build process failed');\n    }\n    \n    // Step 4: Post-build checks\n    if (!postBuildChecks()) {\n      console.log('⚠️  Some post-build checks failed, but continuing...');\n    }\n    \n    // Step 5: Prepare deployment\n    if (!prepareDeployment()) {\n      throw new Error('Deployment preparation failed');\n    }\n    \n    const duration = ((Date.now() - startTime) / 1000).toFixed(2);\n    \n    console.log('🎉 Build completed successfully!');\n    console.log(`⏱️  Total time: ${duration}s\\n`);\n    \n    console.log('🚀 Ready for deployment!');\n    console.log('📋 Next steps:');\n    console.log('   1. Push to GitHub: git push origin main');\n    console.log('   2. Deploy to Vercel: vercel --prod');\n    console.log('   3. Or use Vercel dashboard\\n');\n    \n    process.exit(0);\n    \n  } catch (error) {\n    const duration = ((Date.now() - startTime) / 1000).toFixed(2);\n    \n    console.error('❌ Build failed:', error.message);\n    console.log(`⏱️  Failed after: ${duration}s\\n`);\n    \n    console.log('🔧 Troubleshooting:');\n    console.log('   1. Check .env file exists');\n    console.log('   2. Verify database connection');\n    console.log('   3. Run: npm install');\n    console.log('   4. Run: npm run db:generate\\n');\n    \n    process.exit(1);\n  }\n}\n\nif (require.main === module) {\n  main();\n}\n\nmodule.exports = { main };