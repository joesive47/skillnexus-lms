#!/usr/bin/env node

/**
 * 🚀 SCORM Auto Upload & Deploy Script
 * Upload SCORM packages to GitHub Releases and update database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  SCORM_DIR: './public/scorm-packages',
  RELEASE_VERSION: 'v1.0.0',
  RELEASE_TITLE: 'SCORM Packages v1.0',
  RELEASE_NOTES: 'Initial SCORM packages release for SkillNexus LMS',
  GITHUB_REPO: '', // Will be auto-detected
};

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    if (!silent) log(output, 'cyan');
    return output.trim();
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    throw error;
  }
}

// Step 1: Check prerequisites
function checkPrerequisites() {
  log('\n📋 Step 1: Checking prerequisites...', 'blue');
  
  try {
    exec('git --version', true);
    log('✅ Git installed', 'green');
  } catch {
    log('❌ Git not installed. Please install Git first.', 'red');
    process.exit(1);
  }

  try {
    exec('gh --version', true);
    log('✅ GitHub CLI installed', 'green');
  } catch {
    log('⚠️  GitHub CLI not installed. Installing...', 'yellow');
    log('Please install from: https://cli.github.com/', 'yellow');
    log('Or run: winget install GitHub.cli', 'yellow');
    process.exit(1);
  }

  // Check if logged in to GitHub
  try {
    exec('gh auth status', true);
    log('✅ GitHub CLI authenticated', 'green');
  } catch {
    log('⚠️  Not logged in to GitHub. Running login...', 'yellow');
    exec('gh auth login');
  }
}

// Step 2: Get repository info
function getRepoInfo() {
  log('\n📦 Step 2: Getting repository info...', 'blue');
  
  try {
    const remoteUrl = exec('git config --get remote.origin.url', true);
    log(`Repository: ${remoteUrl}`, 'cyan');
    
    // Extract owner/repo from URL
    const match = remoteUrl.match(/github\.com[:/](.+?)\.git/);
    if (match) {
      CONFIG.GITHUB_REPO = match[1];
      log(`✅ Detected repo: ${CONFIG.GITHUB_REPO}`, 'green');
    }
  } catch (error) {
    log('❌ Not a git repository or no remote configured', 'red');
    process.exit(1);
  }
}

// Step 3: Find SCORM packages
function findScormPackages() {
  log('\n🔍 Step 3: Finding SCORM packages...', 'blue');
  
  if (!fs.existsSync(CONFIG.SCORM_DIR)) {
    log(`❌ Directory not found: ${CONFIG.SCORM_DIR}`, 'red');
    process.exit(1);
  }

  const files = fs.readdirSync(CONFIG.SCORM_DIR);
  const zipFiles = files.filter(f => f.endsWith('.zip'));

  if (zipFiles.length === 0) {
    log('❌ No .zip files found in scorm-packages directory', 'red');
    process.exit(1);
  }

  log(`✅ Found ${zipFiles.length} SCORM package(s):`, 'green');
  zipFiles.forEach((file, index) => {
    const filePath = path.join(CONFIG.SCORM_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    log(`   ${index + 1}. ${file} (${sizeMB} MB)`, 'cyan');
  });

  return zipFiles;
}

// Step 4: Create or update release
function createRelease(zipFiles) {
  log('\n🚀 Step 4: Creating GitHub Release...', 'blue');

  // Check if release exists
  try {
    exec(`gh release view ${CONFIG.RELEASE_VERSION}`, true);
    log(`⚠️  Release ${CONFIG.RELEASE_VERSION} already exists`, 'yellow');
    log('Deleting old release...', 'yellow');
    exec(`gh release delete ${CONFIG.RELEASE_VERSION} -y`, true);
  } catch {
    // Release doesn't exist, that's fine
  }

  // Create new release
  log(`Creating release ${CONFIG.RELEASE_VERSION}...`, 'cyan');
  
  const filePaths = zipFiles.map(f => path.join(CONFIG.SCORM_DIR, f)).join(' ');
  
  try {
    exec(`gh release create ${CONFIG.RELEASE_VERSION} ${filePaths} --title "${CONFIG.RELEASE_TITLE}" --notes "${CONFIG.RELEASE_NOTES}"`);
    log('✅ Release created successfully!', 'green');
  } catch (error) {
    log('❌ Failed to create release', 'red');
    process.exit(1);
  }
}

// Step 5: Get download URLs
function getDownloadUrls(zipFiles) {
  log('\n🔗 Step 5: Getting download URLs...', 'blue');

  const urls = {};
  
  zipFiles.forEach(file => {
    const url = `https://github.com/${CONFIG.GITHUB_REPO}/releases/download/${CONFIG.RELEASE_VERSION}/${file}`;
    urls[file] = url;
    log(`${file}:`, 'cyan');
    log(`  ${url}`, 'green');
  });

  return urls;
}

// Step 6: Generate SQL update script
function generateSqlScript(urls) {
  log('\n📝 Step 6: Generating SQL update script...', 'blue');

  const sqlFile = './update-scorm-urls.sql';
  let sql = `-- Auto-generated SQL script to update SCORM URLs\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n\n`;

  // Map filenames to course titles (you can customize this)
  const courseMapping = {
    'prompt-engineering-scorm.zip': 'Prompt Engineering Mastery',
    'scorm-test.zip': 'SCORM Test Course',
    'scorm-sample-demo.zip': 'SCORM Sample Demo',
    'scorm-working-demo.zip': 'SCORM Working Demo',
  };

  Object.entries(urls).forEach(([filename, url]) => {
    const courseTitle = courseMapping[filename] || filename.replace('.zip', '');
    
    sql += `-- Update: ${courseTitle}\n`;
    sql += `UPDATE "Course"\n`;
    sql += `SET "scormUrl" = '${url}',\n`;
    sql += `    "scormVersion" = '2004',\n`;
    sql += `    "updatedAt" = CURRENT_TIMESTAMP\n`;
    sql += `WHERE "title" ILIKE '%${courseTitle.split('-')[0]}%'\n`;
    sql += `  AND "scormUrl" IS NULL;\n\n`;
  });

  // Add insert statements for new courses
  sql += `\n-- Insert new courses if they don't exist\n\n`;
  
  Object.entries(urls).forEach(([filename, url]) => {
    const courseTitle = courseMapping[filename] || filename.replace('.zip', '');
    
    sql += `INSERT INTO "Course" (\n`;
    sql += `  "id", "title", "description", "scormUrl", "scormVersion",\n`;
    sql += `  "duration", "level", "published", "createdAt", "updatedAt"\n`;
    sql += `) VALUES (\n`;
    sql += `  gen_random_uuid(),\n`;
    sql += `  '${courseTitle}',\n`;
    sql += `  'SCORM 2004 compliant course',\n`;
    sql += `  '${url}',\n`;
    sql += `  '2004',\n`;
    sql += `  120,\n`;
    sql += `  'INTERMEDIATE',\n`;
    sql += `  true,\n`;
    sql += `  CURRENT_TIMESTAMP,\n`;
    sql += `  CURRENT_TIMESTAMP\n`;
    sql += `) ON CONFLICT DO NOTHING;\n\n`;
  });

  fs.writeFileSync(sqlFile, sql);
  log(`✅ SQL script saved: ${sqlFile}`, 'green');
  
  return sqlFile;
}

// Step 7: Update database
async function updateDatabase(sqlFile) {
  log('\n💾 Step 7: Updating database...', 'blue');

  // Check if DATABASE_URL exists
  require('dotenv').config();
  
  if (!process.env.DATABASE_URL) {
    log('⚠️  DATABASE_URL not found in .env', 'yellow');
    log('Please run the SQL script manually:', 'yellow');
    log(`   psql $DATABASE_URL -f ${sqlFile}`, 'cyan');
    return;
  }

  try {
    // Use Prisma to execute SQL
    log('Executing SQL script...', 'cyan');
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    
    // Create a temporary script to execute
    const execScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sql = \`${sql.replace(/`/g, '\\`')}\`;
  await prisma.$executeRawUnsafe(sql);
  console.log('✅ Database updated successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
`;

    fs.writeFileSync('./temp-update-db.js', execScript);
    exec('node temp-update-db.js');
    fs.unlinkSync('./temp-update-db.js');
    
    log('✅ Database updated successfully!', 'green');
  } catch (error) {
    log('⚠️  Could not update database automatically', 'yellow');
    log('Please run manually:', 'yellow');
    log(`   node -e "require('./prisma/client').prisma.$executeRawUnsafe(require('fs').readFileSync('${sqlFile}', 'utf-8'))"`, 'cyan');
  }
}

// Step 8: Generate summary
function generateSummary(urls) {
  log('\n📊 Step 8: Generating summary...', 'blue');

  const summaryFile = './SCORM-DEPLOYMENT-SUMMARY.md';
  let summary = `# 🚀 SCORM Deployment Summary\n\n`;
  summary += `**Date:** ${new Date().toLocaleString()}\n`;
  summary += `**Release:** ${CONFIG.RELEASE_VERSION}\n`;
  summary += `**Repository:** ${CONFIG.GITHUB_REPO}\n\n`;
  
  summary += `## 📦 Deployed Packages\n\n`;
  Object.entries(urls).forEach(([filename, url], index) => {
    summary += `### ${index + 1}. ${filename}\n`;
    summary += `**URL:** ${url}\n\n`;
    summary += `**Test Download:**\n`;
    summary += `\`\`\`bash\n`;
    summary += `curl -L "${url}" -o ${filename}\n`;
    summary += `\`\`\`\n\n`;
  });

  summary += `## 🔗 Quick Links\n\n`;
  summary += `- [GitHub Release](https://github.com/${CONFIG.GITHUB_REPO}/releases/tag/${CONFIG.RELEASE_VERSION})\n`;
  summary += `- [All Releases](https://github.com/${CONFIG.GITHUB_REPO}/releases)\n\n`;

  summary += `## 📝 Next Steps\n\n`;
  summary += `1. ✅ SCORM packages uploaded to GitHub Releases\n`;
  summary += `2. ✅ Download URLs generated\n`;
  summary += `3. ⏳ Update database with SQL script: \`update-scorm-urls.sql\`\n`;
  summary += `4. ⏳ Test SCORM player with new URLs\n`;
  summary += `5. ⏳ Verify course access in production\n\n`;

  summary += `## 🧪 Testing\n\n`;
  summary += `\`\`\`bash\n`;
  summary += `# Test download\n`;
  Object.entries(urls).forEach(([filename, url]) => {
    summary += `curl -I "${url}"\n`;
  });
  summary += `\`\`\`\n`;

  fs.writeFileSync(summaryFile, summary);
  log(`✅ Summary saved: ${summaryFile}`, 'green');
}

// Main execution
async function main() {
  log('🚀 SCORM Auto Upload & Deploy Script', 'blue');
  log('=====================================\n', 'blue');

  try {
    checkPrerequisites();
    getRepoInfo();
    const zipFiles = findScormPackages();
    createRelease(zipFiles);
    const urls = getDownloadUrls(zipFiles);
    const sqlFile = generateSqlScript(urls);
    await updateDatabase(sqlFile);
    generateSummary(urls);

    log('\n✅ ========================================', 'green');
    log('✅ SCORM DEPLOYMENT COMPLETED!', 'green');
    log('✅ ========================================\n', 'green');

    log('📄 Files generated:', 'cyan');
    log('   - update-scorm-urls.sql (SQL script)', 'cyan');
    log('   - SCORM-DEPLOYMENT-SUMMARY.md (Summary)', 'cyan');

    log('\n🔗 Access your SCORM packages at:', 'blue');
    log(`   https://github.com/${CONFIG.GITHUB_REPO}/releases/tag/${CONFIG.RELEASE_VERSION}`, 'green');

  } catch (error) {
    log('\n❌ Deployment failed!', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Run
main();
