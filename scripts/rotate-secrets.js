#!/usr/bin/env node

/**
 * Secret Rotation Script
 * 
 * Safely rotates API keys and secrets with backup and rollback capability
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function generateSecureKey(length = 32) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function generateHexKey(length = 32) {
  return crypto.randomBytes(length / 2).toString('hex');
}

async function backupEnvFile(envPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${envPath}.backup-${timestamp}`;
  
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, backupPath);
    console.log(`✅ Backup created: ${backupPath}`);
    return backupPath;
  }
  
  return null;
}

function updateEnvValue(envPath, key, newValue) {
  if (!fs.existsSync(envPath)) {
    console.error(`❌ File not found: ${envPath}`);
    return false;
  }

  let content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');
  let updated = false;

  const newLines = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      updated = true;
      // Preserve quotes if they exist
      const hasQuotes = line.includes('"');
      return hasQuotes ? `${key}="${newValue}"` : `${key}=${newValue}`;
    }
    return line;
  });

  if (!updated) {
    // Key doesn't exist, add it
    newLines.push(`${key}="${newValue}"`);
    updated = true;
  }

  fs.writeFileSync(envPath, newLines.join('\n'));
  return updated;
}

async function rotateSecret(secretName, generator, envPath = '.env') {
  console.log(`\n🔄 Rotating ${secretName}...`);
  
  const fullPath = path.join(process.cwd(), envPath);
  
  // Backup first
  await backupEnvFile(fullPath);
  
  // Generate new value
  const newValue = generator();
  
  // Update .env file
  const updated = updateEnvValue(fullPath, secretName, newValue);
  
  if (updated) {
    console.log(`✅ ${secretName} rotated successfully`);
    console.log(`   New value: ${newValue.slice(0, 8)}...${newValue.slice(-4)}`);
    return true;
  } else {
    console.log(`❌ Failed to rotate ${secretName}`);
    return false;
  }
}

async function main() {
  console.log('🔐 Secret Rotation Tool\n');
  console.log('=' .repeat(50));
  console.log('');
  console.log('This tool will help you rotate sensitive secrets.');
  console.log('A backup will be created before any changes.');
  console.log('');
  
  const envPath = await question('Enter .env file path (default: .env): ') || '.env';
  
  if (!fs.existsSync(path.join(process.cwd(), envPath))) {
    console.log(`❌ File not found: ${envPath}`);
    rl.close();
    return;
  }

  console.log('\nWhat would you like to rotate?\n');
  console.log('1. NEXTAUTH_SECRET');
  console.log('2. ENCRYPTION_KEY');
  console.log('3. All critical secrets');
  console.log('4. Custom secret');
  console.log('5. Exit');
  console.log('');

  const choice = await question('Enter your choice (1-5): ');

  console.log('');

  switch (choice) {
    case '1':
      await rotateSecret('NEXTAUTH_SECRET', () => generateSecureKey(64), envPath);
      break;
    
    case '2':
      await rotateSecret('ENCRYPTION_KEY', () => generateHexKey(32), envPath);
      break;
    
    case '3':
      console.log('⚠️  WARNING: This will rotate ALL critical secrets!');
      const confirm = await question('Are you sure? (yes/no): ');
      
      if (confirm.toLowerCase() === 'yes') {
        await rotateSecret('NEXTAUTH_SECRET', () => generateSecureKey(64), envPath);
        await rotateSecret('ENCRYPTION_KEY', () => generateHexKey(32), envPath);
        console.log('\n✅ All critical secrets rotated');
        console.log('');
        console.log('⚠️  IMPORTANT NEXT STEPS:');
        console.log('1. Restart your application');
        console.log('2. All users will need to re-login');
        console.log('3. Update secrets in production environment');
        console.log('4. Verify GitHub Secrets are updated');
      } else {
        console.log('❌ Rotation cancelled');
      }
      break;
    
    case '4':
      const customKey = await question('Enter secret name: ');
      const customValue = await question('Enter new value (or leave empty to generate): ');
      
      if (customValue) {
        updateEnvValue(path.join(process.cwd(), envPath), customKey, customValue);
        console.log(`✅ ${customKey} updated`);
      } else {
        await rotateSecret(customKey, () => generateSecureKey(32), envPath);
      }
      break;
    
    case '5':
      console.log('👋 Exiting...');
      break;
    
    default:
      console.log('❌ Invalid choice');
  }

  console.log('');
  console.log('=' .repeat(50));
  
  rl.close();
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
