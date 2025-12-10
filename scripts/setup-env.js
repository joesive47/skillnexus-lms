/**
 * Environment Setup Script
 * สร้าง .env file พร้อม default values สำหรับ development
 */

const fs = require('fs');
const crypto = require('crypto');

console.log('🔧 Setting up environment variables...');

// Generate secure random keys
function generateSecretKey(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

// Check if .env exists
const envExists = fs.existsSync('.env');
const envLocalExists = fs.existsSync('.env.local');

if (envExists || envLocalExists) {
  console.log('✅ Environment file already exists');
  
  // Check for required variables
  const envContent = fs.readFileSync(envExists ? '.env' : '.env.local', 'utf8');
  const missingVars = [];
  
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('⚠️ Missing required variables:', missingVars.join(', '));
    console.log('📝 Please add them to your .env file');
  } else {
    console.log('✅ All required variables are present');
  }
  
  process.exit(0);
}

// Create .env.local for development
const envContent = `# SkillNexus LMS - Development Environment
# Generated on ${new Date().toISOString()}

# Database (Required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus"

# NextAuth (Required)
NEXTAUTH_SECRET="${generateSecretKey()}"
NEXTAUTH_URL="http://localhost:3000"

# Development Mode
NODE_ENV="development"

# Optional Services (can be added later)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# STRIPE_SECRET_KEY=""
# STRIPE_PUBLISHABLE_KEY=""
# REDIS_URL="redis://localhost:6379"
# RESEND_API_KEY=""
# OPENAI_API_KEY=""

# Security (Development)
ENCRYPTION_KEY="${generateSecretKey()}"

# Performance
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local with default development settings');
  console.log('');
  console.log('📋 Next steps:');
  console.log('  1. Update DATABASE_URL with your PostgreSQL credentials');
  console.log('  2. Add optional API keys as needed');
  console.log('  3. Run: npm run db:push');
  console.log('  4. Run: npm run dev');
  console.log('');
  console.log('🔒 Security note: .env.local is already in .gitignore');
} catch (error) {
  console.error('❌ Failed to create .env.local:', error.message);
  process.exit(1);
}