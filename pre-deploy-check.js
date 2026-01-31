#!/usr/bin/env node

/**
 * Pre-Deployment Checklist
 * ตรวจสอบระบบก่อน push to GitHub และ auto-deploy to Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 กำลังตรวจสอบระบบก่อน Deploy...\n');

const checks = {
  passed: [],
  warnings: [],
  errors: []
};

// 1. ตรวจสอบ Environment Variables
console.log('1️⃣ ตรวจสอบ Environment Variables...');
try {
  const envExample = fs.readFileSync('.env.production.example', 'utf8');
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  requiredVars.forEach(varName => {
    if (envExample.includes(varName)) {
      checks.passed.push(`✅ ${varName} มีใน .env.production.example`);
    }
  });
} catch (error) {
  checks.errors.push(`❌ ไม่พบไฟล์ .env.production.example`);
}

// 2. ตรวจสอบ package.json
console.log('\n2️⃣ ตรวจสอบ package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.scripts.build) {
    checks.passed.push('✅ มี build script');
  } else {
    checks.errors.push('❌ ไม่มี build script');
  }
  
  if (pkg.dependencies['@prisma/client']) {
    checks.passed.push('✅ มี Prisma Client');
  }
  
  if (pkg.dependencies['next']) {
    checks.passed.push('✅ มี Next.js');
  }
} catch (error) {
  checks.errors.push('❌ ไม่สามารถอ่าน package.json');
}

// 3. ตรวจสอบ Prisma Schema
console.log('\n3️⃣ ตรวจสอบ Prisma Schema...');
try {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  
  if (schema.includes('provider = "postgresql"')) {
    checks.passed.push('✅ ใช้ PostgreSQL (เหมาะสำหรับ production)');
  } else if (schema.includes('provider = "sqlite"')) {
    checks.warnings.push('⚠️ ใช้ SQLite (ควรเปลี่ยนเป็น PostgreSQL สำหรับ production)');
  }
  
  if (schema.includes('generator client')) {
    checks.passed.push('✅ มี Prisma Client generator');
  }
} catch (error) {
  checks.errors.push('❌ ไม่พบ prisma/schema.prisma');
}

// 4. ตรวจสอบ Next.js Config
console.log('\n4️⃣ ตรวจสอบ Next.js Config...');
try {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  
  if (nextConfig.includes("output: 'standalone'")) {
    checks.passed.push('✅ มี standalone output (เหมาะสำหรับ Docker/Vercel)');
  }
  
  checks.passed.push('✅ มีไฟล์ next.config.js');
} catch (error) {
  checks.errors.push('❌ ไม่พบ next.config.js');
}

// 5. ตรวจสอบ Vercel Config
console.log('\n5️⃣ ตรวจสอบ Vercel Config...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  if (vercelConfig.buildCommand) {
    checks.passed.push('✅ มี buildCommand ใน vercel.json');
  }
  
  if (vercelConfig.framework === 'nextjs') {
    checks.passed.push('✅ ระบุ framework เป็น nextjs');
  }
} catch (error) {
  checks.warnings.push('⚠️ ไม่พบ vercel.json (Vercel จะใช้ค่า default)');
}

// 6. ตรวจสอบ GitHub Actions
console.log('\n6️⃣ ตรวจสอบ GitHub Actions...');
try {
  const workflowPath = '.github/workflows/deploy.yml';
  if (fs.existsSync(workflowPath)) {
    const workflow = fs.readFileSync(workflowPath, 'utf8');
    
    if (workflow.includes('VERCEL_TOKEN')) {
      checks.passed.push('✅ มี GitHub Actions workflow สำหรับ auto-deploy');
    }
  } else {
    checks.warnings.push('⚠️ ไม่พบ GitHub Actions workflow (ต้องตั้งค่า manual deploy)');
  }
} catch (error) {
  checks.warnings.push('⚠️ ไม่สามารถตรวจสอบ GitHub Actions');
}

// 7. ตรวจสอบขนาดไฟล์
console.log('\n7️⃣ ตรวจสอบขนาดไฟล์...');
const largeFiles = [];
const checkDir = (dir) => {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile() && stat.size > 10 * 1024 * 1024) { // > 10MB
      largeFiles.push(`${filePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  });
};

try {
  checkDir('public');
  
  if (largeFiles.length > 0) {
    checks.warnings.push(`⚠️ พบไฟล์ขนาดใหญ่ (>10MB):\n  ${largeFiles.join('\n  ')}`);
  } else {
    checks.passed.push('✅ ไม่มีไฟล์ขนาดใหญ่เกินไป');
  }
} catch (error) {
  checks.warnings.push('⚠️ ไม่สามารถตรวจสอบขนาดไฟล์');
}

// 8. ตรวจสอบ .gitignore
console.log('\n8️⃣ ตรวจสอบ .gitignore...');
try {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  
  const shouldIgnore = [
    'node_modules',
    '.env',
    '.next',
    '*.log'
  ];
  
  shouldIgnore.forEach(pattern => {
    if (gitignore.includes(pattern)) {
      checks.passed.push(`✅ .gitignore มี ${pattern}`);
    } else {
      checks.warnings.push(`⚠️ .gitignore ควรมี ${pattern}`);
    }
  });
} catch (error) {
  checks.errors.push('❌ ไม่พบ .gitignore');
}

// แสดงผลสรุป
console.log('\n' + '='.repeat(60));
console.log('📊 สรุปผลการตรวจสอบ');
console.log('='.repeat(60));

console.log(`\n✅ ผ่าน: ${checks.passed.length} รายการ`);
checks.passed.forEach(msg => console.log(`  ${msg}`));

if (checks.warnings.length > 0) {
  console.log(`\n⚠️ คำเตือน: ${checks.warnings.length} รายการ`);
  checks.warnings.forEach(msg => console.log(`  ${msg}`));
}

if (checks.errors.length > 0) {
  console.log(`\n❌ ข้อผิดพลาด: ${checks.errors.length} รายการ`);
  checks.errors.forEach(msg => console.log(`  ${msg}`));
}

console.log('\n' + '='.repeat(60));

if (checks.errors.length > 0) {
  console.log('❌ พบข้อผิดพลาด! กรุณาแก้ไขก่อน deploy');
  process.exit(1);
} else if (checks.warnings.length > 0) {
  console.log('⚠️ พบคำเตือน แต่สามารถ deploy ได้');
  console.log('💡 แนะนำให้แก้ไขคำเตือนเพื่อประสิทธิภาพที่ดีขึ้น');
} else {
  console.log('✅ ระบบพร้อม Deploy!');
}

console.log('\n📝 ขั้นตอนถัดไป:');
console.log('1. ตรวจสอบ Environment Variables ใน Vercel Dashboard');
console.log('2. git add .');
console.log('3. git commit -m "Ready for production deployment"');
console.log('4. git push origin main');
console.log('5. Vercel จะ auto-deploy อัตโนมัติ\n');
