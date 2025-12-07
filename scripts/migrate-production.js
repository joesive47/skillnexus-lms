#!/usr/bin/env node

/**
 * Production Migration Script
 * Migrates database and seeds initial data for production deployment
 */

const { execSync } = require('child_process');

async function runMigration() {
  console.log('🚀 Starting production migration...');
  
  try {
    // 1. Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // 2. Deploy migrations
    console.log('🔄 Deploying database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    // 3. Seed database
    console.log('🌱 Seeding database...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    
    console.log('✅ Production migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();