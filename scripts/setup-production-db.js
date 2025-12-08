#!/usr/bin/env node

/**
 * Production Database Setup Script
 * Run this after setting up your production database
 */

const { execSync } = require('child_process');

console.log('🚀 Setting up Production Database...\n');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Deploy migrations
  console.log('🔄 Deploying database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  // Seed database
  console.log('🌱 Seeding database with initial data...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('\n✅ Production database setup completed!');
  console.log('\n🎯 Next steps:');
  console.log('1. Verify database connection: npx prisma studio');
  console.log('2. Test login at: https://uppowerskill.com/login');
  console.log('3. Use test account: admin@skillnexus.com / Admin@123!');

} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check DATABASE_URL in environment variables');
  console.log('2. Ensure database is accessible');
  console.log('3. Verify network connectivity');
  process.exit(1);
}