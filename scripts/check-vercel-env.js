#!/usr/bin/env node

/**
 * Check Vercel Environment Variables
 */

console.log('🔍 Checking Vercel Environment Variables...\n');

const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL', 
  'AUTH_URL',
  'NEXT_PUBLIC_URL',
  'NEXTAUTH_SECRET',
  'AUTH_SECRET',
  'NODE_ENV',
  'AUTH_TRUST_HOST'
];

console.log('📋 Required Variables for Production:');
console.log('=====================================');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  console.log(`${status} ${varName}: ${value ? 'SET' : 'MISSING'}`);
});

console.log('\n🎯 Expected Values:');
console.log('DATABASE_URL: prisma+postgres://accelerate.prisma-data.net/...');
console.log('NEXTAUTH_URL: https://uppowerskill.com');
console.log('AUTH_URL: https://uppowerskill.com');
console.log('NEXT_PUBLIC_URL: https://uppowerskill.com');
console.log('NODE_ENV: production');
console.log('AUTH_TRUST_HOST: true');

console.log('\n📝 Add missing variables to Vercel Dashboard:');
console.log('Settings → Environment Variables → Add Variable');