#!/usr/bin/env node

/**
 * Setup existing Prisma Accelerate database
 */

import { execSync } from 'child_process';

const DATABASE_URL = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19DSTdvdEZ5UGdkdkRJYXBBMEdMaEEiLCJhcGlfa2V5IjoiMDFLQlNEWTJONVNDQUYwOUtDQjg5QjRFRzEiLCJ0ZW5hbnRfaWQiOiI5OTNlODhkMGVhMjBhNmQ1YTUwMjdiOGFiNzBmYTY0NGFlMGMxZGVlNDQ1MDcwN2VlNmMxOGFlN2IwNjk3YWU0IiwiaW50ZXJuYWxfc2VjcmV0IjoiNjZkN2E2ZDEtZDZmOS00YjZkLThjZGQtZTVhNDQ0NTZlY2QyIn0.DomkWDfFZJiPs1s06AhiDf3OIi9RVf0UR6m28Rl6n-k";

console.log('🗄️ Setting up existing Prisma Accelerate database...\n');

// Set environment variable for this session
process.env.DATABASE_URL = DATABASE_URL;

try {
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('🔄 Deploying migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  console.log('🌱 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('\n✅ Database setup completed!');
  console.log('\n🎯 Ready to test:');
  console.log('1. Update Vercel environment variables');
  console.log('2. Redeploy application');
  console.log('3. Test login at https://uppowerskill.com/login');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n🔧 Database might already be set up');
  console.log('Try testing login directly');
}