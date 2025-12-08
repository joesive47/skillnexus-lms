#!/usr/bin/env node

/**
 * Connect to Production Database (uppowerskill-db)
 */

const { execSync } = require('child_process');

console.log('🗄️ Connecting to uppowerskill-db...\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL not found in environment variables');
  console.log('\n📋 Steps to fix:');
  console.log('1. Go to Vercel Dashboard → uppowerskill.com → Storage');
  console.log('2. Click "uppowerskill-db" → Settings → General');
  console.log('3. Copy DATABASE_URL');
  console.log('4. Add to Environment Variables in Vercel');
  console.log('5. Redeploy the application');
  process.exit(1);
}

try {
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('🔄 Deploying migrations to uppowerskill-db...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  console.log('🌱 Seeding database with test accounts...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('\n✅ uppowerskill-db connected successfully!');
  console.log('\n🎯 Test login:');
  console.log('URL: https://uppowerskill.com/login');
  console.log('Email: admin@skillnexus.com');
  console.log('Password: Admin@123!');

} catch (error) {
  console.error('\n❌ Database connection failed:', error.message);
  console.log('\n🔧 Check:');
  console.log('1. DATABASE_URL format: postgresql://user:pass@host:port/db');
  console.log('2. Database is accessible from Vercel');
  console.log('3. Network connectivity');
}