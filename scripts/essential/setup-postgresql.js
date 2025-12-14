#!/usr/bin/env node

/**
 * PostgreSQL Setup Script for SkillNexus LMS
 * Automatically configures PostgreSQL database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐘 Setting up PostgreSQL for SkillNexus LMS...\n');

// Check if PostgreSQL is installed
function checkPostgreSQL() {
  try {
    execSync('psql --version', { stdio: 'pipe' });
    console.log('✅ PostgreSQL is installed');
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL is not installed');
    console.log('Please install PostgreSQL first:');
    console.log('- Windows: https://www.postgresql.org/download/windows/');
    console.log('- macOS: brew install postgresql');
    console.log('- Linux: sudo apt-get install postgresql postgresql-contrib');
    return false;
  }
}

// Create database
function createDatabase() {
  try {
    console.log('📦 Creating SkillNexus database...');
    
    // Try to create database (will fail if already exists, which is fine)
    try {
      execSync('createdb skillnexus', { stdio: 'pipe' });
      console.log('✅ Database "skillnexus" created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Database "skillnexus" already exists');
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed to create database:', error.message);
    console.log('Please create the database manually:');
    console.log('createdb skillnexus');
    return false;
  }
}

// Update environment file
function updateEnvironment() {
  const envPath = path.join(process.cwd(), '.env');
  const postgresEnvPath = path.join(process.cwd(), '.env.postgresql');
  
  try {
    if (fs.existsSync(postgresEnvPath)) {
      fs.copyFileSync(postgresEnvPath, envPath);
      console.log('✅ Environment updated for PostgreSQL');
    } else {
      console.log('⚠️  PostgreSQL environment template not found');
    }
  } catch (error) {
    console.log('❌ Failed to update environment:', error.message);
  }
}

// Run Prisma migrations
function runMigrations() {
  try {
    console.log('🔄 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🔄 Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('🌱 Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });
    
    console.log('✅ Database setup completed successfully!');
    return true;
  } catch (error) {
    console.log('❌ Failed to run migrations:', error.message);
    return false;
  }
}

// Main setup function
async function main() {
  console.log('🚀 SkillNexus PostgreSQL Setup\n');
  
  // Step 1: Check PostgreSQL installation
  if (!checkPostgreSQL()) {
    process.exit(1);
  }
  
  // Step 2: Create database
  if (!createDatabase()) {
    console.log('⚠️  Continuing with existing database...');
  }
  
  // Step 3: Update environment
  updateEnvironment();
  
  // Step 4: Run migrations
  if (runMigrations()) {
    console.log('\n🎉 PostgreSQL setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your DATABASE_URL in .env with your PostgreSQL credentials');
    console.log('2. Run: npm run dev');
    console.log('3. Visit: http://localhost:3000');
  } else {
    console.log('\n❌ Setup failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run the setup
main().catch(console.error);