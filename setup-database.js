// Setup SQLite Database
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up SQLite database...');

try {
  // สร้าง prisma folder ถ้าไม่มี
  const prismaDir = path.join(__dirname, 'prisma');
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }

  // สร้างไฟล์ database ว่างๆ
  const dbPath = path.join(prismaDir, 'dev.db');
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
    console.log('✅ Created dev.db file');
  }

  console.log('✅ Database setup complete!');
  console.log('📍 Database location:', dbPath);
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
}