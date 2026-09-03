const fs = require('fs');
const path = require('path');

// ฟังก์ชันค้นหาไฟล์ route.ts ทั้งหมด
function findRouteFiles(dir) {
  const files = [];
  
  function searchDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else if (item === 'route.ts') {
        files.push(fullPath);
      }
    }
  }
  
  searchDir(dir);
  return files;
}

// ฟังก์ชันแก้ไขไฟล์
function fixRouteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let originalContent = content;
  
  // ตรวจสอบว่าไฟล์มี dynamic parameters หรือไม่
  const hasDynamicParams = /\{\s*params\s*\}:\s*\{\s*params:/.test(content);
  const hasParamsUsage = /params\.(\w+)/.test(content);
  
  if (!hasDynamicParams && !hasParamsUsage) {
    return false; // ไม่มี dynamic params ไม่ต้องแก้
  }
  
  // ตรวจสอบว่าเป็นไฟล์ที่มี dynamic route หรือไม่
  const isDynamicRoute = filePath.includes('[') && filePath.includes(']');
  
  if (!isDynamicRoute && hasParamsUsage) {
    console.log(`   ⚠️  Skipping non-dynamic route with params usage`);
    return false;
  }
  
  console.log(`🔧 Processing: ${path.relative(process.cwd(), filePath)}`);
  
  // Pattern 1: แก้ { params }: { params: { id: string } } -> Promise<{ id: string }>
  content = content.replace(
    /\{\s*params\s*\}:\s*\{\s*params:\s*\{([^}]+)\}\s*\}/g,
    '{ params }: { params: Promise<{$1}> }'
  );
  
  // Pattern 2: แก้ [...path] routes
  content = content.replace(
    /\{\s*params\s*\}:\s*\{\s*params:\s*Promise<\{\s*path:\s*string\[\]\s*\}>\s*\}/g,
    '{ params }: { params: Promise<{ path: string[] }> }'
  );
  
  // Pattern 3: หาการใช้ params.xxx และแก้ไข
  const paramUsagePattern = /params\.(\w+)/g;
  const paramMatches = [...content.matchAll(paramUsagePattern)];
  
  if (paramMatches.length > 0 && !content.includes('await params')) {
    // รวบรวม parameter names ที่ใช้
    const paramNames = [...new Set(paramMatches.map(match => match[1]))];
    
    // สร้าง destructuring statement
    const destructuring = `const { ${paramNames.join(', ')} } = await params`;
    
    // หาตำแหน่งที่เหมาะสมในการแทรก
    // ลองหลายรูปแบบ
    if (content.includes('try {')) {
      // แทรกหลัง try {
      content = content.replace(
        /(try\s*\{\s*\n)/,
        `$1    ${destructuring}\n`
      );
    } else if (content.includes('export async function')) {
      // แทรกหลัง function declaration
      content = content.replace(
        /(export async function \w+\([^)]*\)\s*\{\s*\n)/,
        `$1  ${destructuring}\n`
      );
    }
    
    // แทนที่ params.xxx ด้วย xxx
    paramNames.forEach(param => {
      content = content.replace(
        new RegExp(`params\\.${param}`, 'g'),
        param
      );
    });
  }
  
  // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
  if (content !== originalContent) {
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ Updated successfully`);
    return true;
  } else {
    console.log(`   ⏭️  Already up to date`);
    return false;
  }
}

// Main execution
console.log('🔍 Scanning for Next.js route files...');
const apiDir = path.join(__dirname, 'src', 'app', 'api');
const routeFiles = findRouteFiles(apiDir);

console.log(`📁 Found ${routeFiles.length} route files`);

let fixedCount = 0;
routeFiles.forEach(file => {
  if (fixRouteFile(file)) {
    fixedCount++;
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files out of ${routeFiles.length} total files`);
console.log('✅ All Next.js 15 route handlers have been updated!');