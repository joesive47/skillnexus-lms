# RAG Upload Fix Summary

## Issues Fixed

### 1. Database Table Mismatch ✅
- **Problem**: RAG system was querying `documentChunk` table but upload was creating `ragChunk`
- **Fix**: Updated `rag-ultra-fast.ts` to use correct table names (`ragChunk` instead of `documentChunk`)

### 2. PDF Support Missing ✅
- **Problem**: Document processor didn't support PDF files despite frontend showing PDF support
- **Fix**: Added PDF processing using `pdf-parse` library in `document-processor-optimized.ts`

### 3. File Type Validation ✅
- **Problem**: Upload route only allowed TXT, DOCX, DOC but not PDF
- **Fix**: Added PDF to allowed file types in upload route

### 4. Embedding Generation Blocking ✅
- **Problem**: Original upload tried to generate embeddings synchronously, causing timeouts
- **Fix**: Created separate upload flow:
  - `/api/chatbot/upload-simple` - Uploads without embeddings
  - `/api/chatbot/generate-embeddings` - Generates embeddings separately

### 5. Environment Variables ✅
- **Problem**: RAG environment variables had quotes causing parsing issues
- **Fix**: Removed quotes from RAG settings in `.env` file

## New Endpoints Created

1. **`/api/test-upload`** - Test document processing functionality
2. **`/api/chatbot/upload-simple`** - Upload documents without embeddings
3. **`/api/chatbot/generate-embeddings`** - Generate embeddings for existing chunks

## Updated Files

1. `src/lib/document-processor-optimized.ts` - Added PDF support
2. `src/lib/rag-ultra-fast.ts` - Fixed table names
3. `src/app/api/chatbot/upload-document/route.ts` - Added PDF support, increased file size limit
4. `src/app/dashboard/chatbot/page.tsx` - Added embedding generation button
5. `.env` - Fixed RAG environment variables

## How to Use

### For Word/PDF Upload:
1. Go to `/dashboard/chatbot`
2. Select Word (.docx, .doc) or PDF file
3. Click upload - file will be processed and stored
4. Click "สร้าง AI Embeddings" to generate embeddings for search

### For Testing:
1. Use `/test-upload-simple.html` for basic testing
2. Use `/api/test-upload` endpoint for document processing tests

## Supported File Types
- ✅ TXT (Text files)
- ✅ DOCX (Word documents)
- ✅ DOC (Legacy Word documents)
- ✅ PDF (Portable Document Format)

## File Size Limits
- Maximum: 10MB per file
- Recommended: Under 5MB for optimal performance

## Next Steps
1. Test Word file upload at `http://localhost:3000/dashboard/chatbot`
2. Upload a document and generate embeddings
3. Test chatbot functionality with uploaded content
4. Monitor server logs for any remaining issues

## Troubleshooting
- If upload fails, check server console for detailed error messages
- Use `/api/test-upload` to test document processing separately
- Use `/api/chatbot/generate-embeddings` GET to check embedding status