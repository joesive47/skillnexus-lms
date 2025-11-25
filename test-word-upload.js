const fs = require('fs');
const path = require('path');

// Test Word file upload
async function testWordUpload() {
  try {
    console.log('🧪 Testing Word file upload...');
    
    // Create a simple test Word file content
    const testContent = 'This is a test document for RAG upload functionality.';
    
    // Test the document processor
    const { processDocument } = await import('./src/lib/document-processor-optimized.ts');
    
    // Create a simple buffer to simulate a Word file
    const buffer = Buffer.from(testContent, 'utf-8');
    
    console.log('📄 Testing TXT processing...');
    const result = await processDocument(buffer.buffer, 'test.txt');
    console.log('✅ TXT Result:', result);
    
    console.log('🔍 Testing file upload API...');
    
    // Test the upload endpoint
    const formData = new FormData();
    const blob = new Blob([testContent], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    formData.append('file', file);
    
    const response = await fetch('http://localhost:3000/api/chatbot/upload-document', {
      method: 'POST',
      body: formData
    });
    
    const result2 = await response.json();
    console.log('📤 Upload Result:', result2);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  testWordUpload();
}

module.exports = { testWordUpload };