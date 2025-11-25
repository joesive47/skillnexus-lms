// Diagnostic script for RAG upload issues
console.log('🔍 Diagnosing RAG upload system...');

// Check if required packages are available
try {
  const mammoth = require('mammoth');
  console.log('✅ mammoth package loaded');
} catch (error) {
  console.error('❌ mammoth package error:', error.message);
}

try {
  const pdfParse = require('pdf-parse');
  console.log('✅ pdf-parse package loaded');
} catch (error) {
  console.error('❌ pdf-parse package error:', error.message);
}

try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  console.log('✅ Prisma client loaded');
  
  // Test database connection
  prisma.ragDocument.findMany({ take: 1 })
    .then(() => console.log('✅ Database connection working'))
    .catch(error => console.error('❌ Database error:', error.message))
    .finally(() => prisma.$disconnect());
} catch (error) {
  console.error('❌ Prisma error:', error.message);
}

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('RAG_CHUNK_SIZE:', process.env.RAG_CHUNK_SIZE || 'not set');
console.log('RAG_CHUNK_OVERLAP:', process.env.RAG_CHUNK_OVERLAP || 'not set');
console.log('RAG_MAX_RESULTS:', process.env.RAG_MAX_RESULTS || 'not set');
console.log('RAG_FAST_MODE:', process.env.RAG_FAST_MODE || 'not set');

console.log('\n🔧 System Info:');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Memory usage:', process.memoryUsage());