const fs = require('fs');
const path = require('path');

// Check if Prisma client exists and is up to date
function checkPrismaClient() {
  try {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const clientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
    
    // Check if client exists
    if (!fs.existsSync(clientPath)) {
      console.log('❌ Prisma client not found, generating...');
      process.exit(1);
    }
    
    // Check if schema is newer than client
    const schemaStats = fs.statSync(schemaPath);
    const clientStats = fs.statSync(clientPath);
    
    if (schemaStats.mtime > clientStats.mtime) {
      console.log('❌ Schema updated, regenerating client...');
      process.exit(1);
    }
    
    console.log('✅ Prisma client is up to date, skipping generation');
    process.exit(0);
    
  } catch (error) {
    console.log('❌ Error checking Prisma client:', error.message);
    process.exit(1);
  }
}

checkPrismaClient();