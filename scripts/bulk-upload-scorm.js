#!/usr/bin/env node

/**
 * 🚀 SCORM Bulk Upload & Organize Script
 * Copy, organize, and upload all SCORM courses from C:\API\scorm\scorm-courses
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Configuration
const SOURCE_DIR = 'C:\\API\\scorm\\scorm-courses';
const DEST_DIR = './public/scorm-packages';
const RELEASE_VERSION = 'v2.0.0';

// Course categories
const CATEGORIES = {
  'AI & Technology': [
    '1-ai-chatgpt-business',
    '6-ai-software-innovator',
    '7-generative-ai-pro',
    '17-ai-implementation',
    'ai-automation-mastery',
    'ai-solopreneur',
    'blockchain-web3-mastery',
    'cloud-devops',
    'iot-smart-systems',
    'quantum-computing-basics'
  ],
  'Data & Analytics': [
    '2-data-analytics-bi',
    '8-data-driven-decisions',
    '16-data-analytics-leaders',
    'business-intelligence-analytics'
  ],
  'Business & Leadership': [
    '10-agile-leadership',
    '14-digital-strategy',
    'corporate-executive-leadership',
    'consulting-advisory-mastery',
    'ma-corporate-strategy',
    'startup-fundraising-mastery'
  ],
  'Marketing & Sales': [
    '3-digital-marketing',
    '12-growth-hacking',
    'copywriting-persuasion-mastery',
    'ecommerce-mastery',
    'negotiation-sales-mastery'
  ],
  'Product & Design': [
    '11-product-management',
    '15-nocode-bootcamp',
    'uxui-design-bootcamp',
    'ar-vr-metaverse-dev'
  ],
  'Personal Development': [
    'communication-mastery',
    'confidence-charisma-mastery',
    'emotional-intelligence-mastery',
    'habits-systems-mastery',
    'learning-how-to-learn',
    'mindfulness-productivity',
    'resilience-grit-mastery',
    'time-management-mastery',
    'wealth-mindset-mastery'
  ],
  'Creative & Content': [
    'creative-thinking-innovation',
    'creative-writing-storytelling',
    'photography-visual-storytelling',
    'public-speaking-mastery',
    'video-content-mastery',
    'music-production-audio'
  ],
  'Security & Compliance': [
    '4-cybersecurity-pdpa',
    '9-cybersecurity-governance',
    'ai-ethics-responsible-ai'
  ],
  'Finance & Business': [
    '5-financial-literacy',
    'fintech-digital-banking'
  ],
  'Coaching & Training': [
    'coaching-mentoring-mastery',
    'fitness-performance-optimization',
    'nutrition-wellness-coaching'
  ],
  'Industry Specific': [
    'healthcare-digital-transformation',
    'retail-omnichannel-excellence',
    'social-impact-nonprofit',
    'sustainability-esg-leadership'
  ],
  'Capstone': [
    '18-capstone-project',
    'personal-branding-2'
  ]
};

// Step 1: Create destination directory
function setupDirectories() {
  log('\n📁 Step 1: Setting up directories...', 'blue');
  
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
    log(`✅ Created: ${DEST_DIR}`, 'green');
  } else {
    log(`✅ Directory exists: ${DEST_DIR}`, 'green');
  }
}

// Step 2: Copy and organize files
function copyAndOrganize() {
  log('\n📦 Step 2: Copying and organizing SCORM packages...', 'blue');
  
  const zipFiles = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.zip'))
    .sort();

  log(`Found ${zipFiles.length} SCORM packages`, 'cyan');

  let copiedCount = 0;
  const categorized = {};

  zipFiles.forEach((file, index) => {
    const sourcePath = path.join(SOURCE_DIR, file);
    const destPath = path.join(DEST_DIR, file);
    
    // Find category
    let category = 'Uncategorized';
    const baseName = file.replace('.zip', '');
    
    for (const [cat, courses] of Object.entries(CATEGORIES)) {
      if (courses.some(c => baseName.includes(c) || c.includes(baseName))) {
        category = cat;
        break;
      }
    }

    if (!categorized[category]) categorized[category] = [];
    categorized[category].push(file);

    // Copy file
    try {
      fs.copyFileSync(sourcePath, destPath);
      const stats = fs.statSync(destPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      
      log(`  ${index + 1}. ✅ ${file} (${sizeMB} MB) → ${category}`, 'green');
      copiedCount++;
    } catch (error) {
      log(`  ${index + 1}. ❌ Failed: ${file}`, 'red');
    }
  });

  log(`\n✅ Copied ${copiedCount} files`, 'green');
  
  // Show categorization
  log('\n📊 Categorization Summary:', 'magenta');
  Object.entries(categorized).forEach(([cat, files]) => {
    log(`  ${cat}: ${files.length} courses`, 'cyan');
  });

  return { zipFiles, categorized };
}

// Step 3: Create GitHub Release
function createGitHubRelease(zipFiles) {
  log('\n🚀 Step 3: Creating GitHub Release...', 'blue');

  try {
    // Check if release exists
    try {
      execSync(`gh release view ${RELEASE_VERSION}`, { encoding: 'utf-8', stdio: 'pipe' });
      log(`⚠️  Release ${RELEASE_VERSION} exists. Deleting...`, 'yellow');
      execSync(`gh release delete ${RELEASE_VERSION} -y`, { stdio: 'pipe' });
    } catch {
      // Release doesn't exist
    }

    log(`Creating release ${RELEASE_VERSION}...`, 'cyan');
    
    // Upload in batches (GitHub has limits)
    const BATCH_SIZE = 10;
    const batches = [];
    
    for (let i = 0; i < zipFiles.length; i += BATCH_SIZE) {
      batches.push(zipFiles.slice(i, i + BATCH_SIZE));
    }

    // Create release first
    execSync(`gh release create ${RELEASE_VERSION} --title "SCORM Packages v2.0 - Complete Collection" --notes "Complete SCORM 2004 package collection with ${zipFiles.length} courses organized by category"`, { stdio: 'inherit' });

    // Upload files in batches
    batches.forEach((batch, index) => {
      log(`\nUploading batch ${index + 1}/${batches.length}...`, 'cyan');
      const files = batch.map(f => path.join(DEST_DIR, f)).join(' ');
      execSync(`gh release upload ${RELEASE_VERSION} ${files}`, { stdio: 'inherit' });
    });

    log('✅ All files uploaded successfully!', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to create release', 'red');
    log(error.message, 'red');
    return false;
  }
}

// Step 4: Generate URLs
function generateUrls(zipFiles, categorized) {
  log('\n🔗 Step 4: Generating download URLs...', 'blue');

  const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
  const match = remoteUrl.match(/github\.com[:/](.+?)\.git/);
  const repo = match ? match[1] : 'joesive47/skillnexus-lms';

  const urls = {};
  zipFiles.forEach(file => {
    urls[file] = `https://github.com/${repo}/releases/download/${RELEASE_VERSION}/${file}`;
  });

  // Save URLs by category
  let urlDoc = `# 🔗 SCORM Package URLs\n\n`;
  urlDoc += `**Release:** ${RELEASE_VERSION}\n`;
  urlDoc += `**Total Courses:** ${zipFiles.length}\n`;
  urlDoc += `**Repository:** ${repo}\n\n`;

  Object.entries(categorized).forEach(([category, files]) => {
    urlDoc += `## ${category} (${files.length} courses)\n\n`;
    files.forEach(file => {
      const url = urls[file];
      const title = file.replace('.zip', '').replace(/-/g, ' ').replace(/\d+\s*/g, '').trim();
      urlDoc += `### ${title}\n`;
      urlDoc += `**File:** \`${file}\`\n`;
      urlDoc += `**URL:** ${url}\n\n`;
    });
  });

  fs.writeFileSync('./SCORM-URLS-COMPLETE.md', urlDoc);
  log('✅ URLs saved: SCORM-URLS-COMPLETE.md', 'green');

  return urls;
}

// Step 5: Generate SQL
function generateSQL(urls, categorized) {
  log('\n📝 Step 5: Generating SQL script...', 'blue');

  let sql = `-- SCORM Bulk Import SQL Script\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Total Courses: ${Object.keys(urls).length}\n\n`;

  Object.entries(categorized).forEach(([category, files]) => {
    sql += `\n-- ========================================\n`;
    sql += `-- ${category} (${files.length} courses)\n`;
    sql += `-- ========================================\n\n`;

    files.forEach(file => {
      const url = urls[file];
      const baseName = file.replace('.zip', '');
      const title = baseName.replace(/-/g, ' ').replace(/\d+\s*/g, '').trim();
      const titleCase = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      sql += `-- ${titleCase}\n`;
      sql += `INSERT INTO "Course" (\n`;
      sql += `  "id", "title", "description", "scormUrl", "scormVersion",\n`;
      sql += `  "duration", "level", "published", "createdAt", "updatedAt"\n`;
      sql += `) VALUES (\n`;
      sql += `  gen_random_uuid(),\n`;
      sql += `  '${titleCase}',\n`;
      sql += `  'SCORM 2004 compliant course - ${category}',\n`;
      sql += `  '${url}',\n`;
      sql += `  '2004',\n`;
      sql += `  120,\n`;
      sql += `  'INTERMEDIATE',\n`;
      sql += `  true,\n`;
      sql += `  CURRENT_TIMESTAMP,\n`;
      sql += `  CURRENT_TIMESTAMP\n`;
      sql += `) ON CONFLICT DO NOTHING;\n\n`;
    });
  });

  fs.writeFileSync('./scorm-bulk-import.sql', sql);
  log('✅ SQL script saved: scorm-bulk-import.sql', 'green');
}

// Step 6: Generate summary
function generateSummary(zipFiles, categorized) {
  log('\n📊 Step 6: Generating summary report...', 'blue');

  let summary = `# 🎓 SCORM Bulk Upload Summary\n\n`;
  summary += `**Date:** ${new Date().toLocaleString()}\n`;
  summary += `**Release:** ${RELEASE_VERSION}\n`;
  summary += `**Total Courses:** ${zipFiles.length}\n`;
  summary += `**Categories:** ${Object.keys(categorized).length}\n\n`;

  summary += `## 📊 By Category\n\n`;
  Object.entries(categorized).sort((a, b) => b[1].length - a[1].length).forEach(([cat, files]) => {
    summary += `- **${cat}:** ${files.length} courses\n`;
  });

  summary += `\n## 📁 Files Generated\n\n`;
  summary += `1. \`SCORM-URLS-COMPLETE.md\` - All download URLs organized by category\n`;
  summary += `2. \`scorm-bulk-import.sql\` - SQL script to import all courses\n`;
  summary += `3. \`SCORM-BULK-SUMMARY.md\` - This summary report\n\n`;

  summary += `## 🔗 Quick Links\n\n`;
  summary += `- [GitHub Release](https://github.com/joesive47/skillnexus-lms/releases/tag/${RELEASE_VERSION})\n`;
  summary += `- [All Releases](https://github.com/joesive47/skillnexus-lms/releases)\n\n`;

  summary += `## 📝 Next Steps\n\n`;
  summary += `1. ✅ SCORM packages uploaded to GitHub Releases\n`;
  summary += `2. ⏳ Import courses: \`psql $DATABASE_URL -f scorm-bulk-import.sql\`\n`;
  summary += `3. ⏳ Verify in LMS\n`;
  summary += `4. ⏳ Test SCORM player\n`;

  fs.writeFileSync('./SCORM-BULK-SUMMARY.md', summary);
  log('✅ Summary saved: SCORM-BULK-SUMMARY.md', 'green');
}

// Main execution
async function main() {
  log('🚀 SCORM Bulk Upload & Organize Script', 'blue');
  log('==========================================\n', 'blue');

  try {
    setupDirectories();
    const { zipFiles, categorized } = copyAndOrganize();
    
    log('\n⏸️  Ready to upload to GitHub?', 'yellow');
    log('Press Ctrl+C to cancel, or wait 5 seconds to continue...', 'yellow');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const success = createGitHubRelease(zipFiles);
    
    if (success) {
      const urls = generateUrls(zipFiles, categorized);
      generateSQL(urls, categorized);
      generateSummary(zipFiles, categorized);

      log('\n✅ ========================================', 'green');
      log('✅ BULK UPLOAD COMPLETED!', 'green');
      log('✅ ========================================\n', 'green');

      log('📄 Files generated:', 'cyan');
      log('   - SCORM-URLS-COMPLETE.md', 'cyan');
      log('   - scorm-bulk-import.sql', 'cyan');
      log('   - SCORM-BULK-SUMMARY.md', 'cyan');

      log(`\n🔗 View release:`, 'blue');
      log(`   https://github.com/joesive47/skillnexus-lms/releases/tag/${RELEASE_VERSION}`, 'green');
    }

  } catch (error) {
    log('\n❌ Upload failed!', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

main();
