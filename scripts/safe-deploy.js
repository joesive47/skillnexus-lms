#!/usr/bin/env node

// Safe Deployment Script - SkillNexus
// ตรวจสอบความปลอดภัยก่อน deploy

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🛡️ SkillNexus Safe Deployment Check\n')

// 1. Check tests
console.log('1️⃣ Running tests...')
try {
  execSync('npm test', { stdio: 'inherit' })
  console.log('✅ All tests passed\n')
} catch (error) {
  console.error('❌ Tests failed - DEPLOYMENT BLOCKED')
  process.exit(1)
}

// 2. Check build
console.log('2️⃣ Checking build...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build successful\n')
} catch (error) {
  console.error('❌ Build failed - DEPLOYMENT BLOCKED')
  process.exit(1)
}

// 3. Check database schema
console.log('3️⃣ Validating database schema...')
try {
  execSync('npx prisma validate', { stdio: 'inherit' })
  console.log('✅ Schema valid\n')
} catch (error) {
  console.error('❌ Schema invalid - DEPLOYMENT BLOCKED')
  process.exit(1)
}

// 4. Check feature flags
console.log('4️⃣ Checking feature flags...')
const featureFlagsExist = fs.existsSync('src/lib/feature-flags.ts')
if (featureFlagsExist) {
  console.log('✅ Feature flags system ready\n')
} else {
  console.error('❌ Feature flags missing - DEPLOYMENT BLOCKED')
  process.exit(1)
}

// 5. Environment check
console.log('5️⃣ Environment validation...')
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`)
  process.exit(1)
}
console.log('✅ Environment variables OK\n')

console.log('🎉 All checks passed - SAFE TO DEPLOY!')
console.log('\n📋 Next steps:')
console.log('1. Deploy to staging first')
console.log('2. Run smoke tests')
console.log('3. Enable features gradually')
console.log('4. Monitor for 30 minutes')
console.log('5. Full rollout if stable')