# ระบบ Chatbot RAG (Retrieval-Augmented Generation)

## 🎯 ฟีเจอร์

### 1. อัพโหลดเอกสารหลายรูปแบบ
- **PDF** - ไฟล์ PDF ทุกประเภท
- **Word** - .doc, .docx
- **Excel** - .xls, .xlsx (ไม่ลบระบบ Excel Import เดิม)
- **URL** - ดึงข้อมูลจากเว็บไซต์

### 2. Document Processing Pipeline
```
อัพโหลด → แยกข้อความ → แบ่ง Chunks → สร้าง Embeddings → เก็บใน Database
```

### 3. RAG Query Process
```
คำถาม → สร้าง Embedding → ค้นหา Similar Chunks → สร้างคำตอบ
```

## 📦 Dependencies ใหม่

```bash
npm install @xenova/transformers mammoth pdf-parse
```

- **@xenova/transformers**: Local embeddings (ไม่ต้องใช้ OpenAI API)
- **mammoth**: อ่านไฟล์ Word
- **pdf-parse**: อ่านไฟล์ PDF

## 🗄️ Database Schema

### Document Table
```prisma
model Document {
  id           String          @id @default(cuid())
  filename     String
  fileType     String
  fileUrl      String?
  sourceUrl    String?
  courseId     String?
  uploadedBy   String?
  status       String          @default("processing")
  totalChunks  Int             @default(0)
  metadata     String?
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  chunks       DocumentChunk[]
}
```

### DocumentChunk Table
```prisma
model DocumentChunk {
  id         String   @id @default(cuid())
  documentId String
  content    String
  embedding  String?
  metadata   String?
  chunkIndex Int
  createdAt  DateTime @default(now())
  document   Document @relation(fields: [documentId], references: [id])
}
```

## 🚀 การใช้งาน

### 1. Setup Database
```bash
npm run db:generate
npm run db:push
```

### 2. เข้าหน้าจัดการ RAG
```
/dashboard/rag-management
```

### 3. อัพโหลดเอกสาร
- เลือกไฟล์ PDF, Word, Excel หรือ
- ใส่ URL ของเว็บไซต์
- กด "อัพโหลดและประมวลผล"

### 4. ทดสอบ Chatbot
- เปิด Chatbot Widget (มุมขวาล่าง)
- ถามคำถามเกี่ยวกับเอกสารที่อัพโหลด
- ระบบจะค้นหาข้อมูลที่เกี่ยวข้องและตอบ

## 🔧 API Endpoints

### POST /api/documents/upload
อัพโหลดเอกสาร
```typescript
const formData = new FormData()
formData.append('file', file)
// หรือ
formData.append('url', 'https://example.com')
formData.append('courseId', 'course-id') // optional

const response = await fetch('/api/documents/upload', {
  method: 'POST',
  body: formData
})
```

### GET /api/documents/list
ดูรายการเอกสาร
```typescript
const response = await fetch('/api/documents/list?courseId=xxx')
```

### POST /api/chatbot
ส่งคำถามไปยัง Chatbot
```typescript
const response = await fetch('/api/chatbot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'คำถาม',
    sessionId: 'session-id'
  })
})
```

## 🧠 วิธีการทำงาน

### 1. Document Processing
```typescript
// 1. อ่านไฟล์
const text = await processPDF(buffer)

// 2. แบ่ง Chunks (1000 chars, overlap 200)
const chunks = splitTextIntoChunks(text, 1000, 200)

// 3. สร้าง Embeddings
for (const chunk of chunks) {
  const embedding = await generateEmbedding(chunk)
  await saveToDatabase(chunk, embedding)
}
```

### 2. Query Processing
```typescript
// 1. สร้าง Query Embedding
const queryEmbedding = await generateEmbedding(question)

// 2. ค้นหา Similar Chunks (Cosine Similarity)
const similarChunks = await searchSimilarChunks(queryEmbedding, topK=3)

// 3. สร้างคำตอบจาก Context
const context = similarChunks.map(c => c.content).join('\n')
const answer = generateAnswer(context, question)
```

## 🎨 Components

### DocumentUpload
```tsx
import { DocumentUpload } from '@/components/chatbot/document-upload'

<DocumentUpload 
  courseId="course-id"
  onUploadComplete={(docId) => console.log(docId)}
/>
```

### ChatbotWidget (อัพเดตแล้ว)
```tsx
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'

<ChatbotWidget />
```

## 📊 Hybrid Approach

ระบบใช้ **2-tier approach**:

1. **Tier 1**: ตรวจสอบ Q&A ที่กำหนดไว้ก่อน (ChatKnowledgeBase)
2. **Tier 2**: ถ้าไม่พบ ใช้ RAG ค้นหาจากเอกสาร

```typescript
// 1. Check predefined Q&A
const knowledgeBase = await prisma.chatKnowledgeBase.findFirst({
  where: { question: { contains: message } }
})

if (knowledgeBase) {
  return knowledgeBase.answer
}

// 2. Use RAG
const ragResponse = await generateRAGResponse(message)
return ragResponse
```

## ⚡ Performance

### Local Embeddings
ใช้ **Xenova/all-MiniLM-L6-v2** (384 dimensions)
- ไม่ต้องเรียก API ภายนอก
- ประมวลผลบน Server
- ฟรี ไม่มีค่าใช้จ่าย

### Chunking Strategy
- **Chunk Size**: 1000 characters
- **Overlap**: 200 characters
- **Top K**: 3 most relevant chunks

### Similarity Search
- **Algorithm**: Cosine Similarity
- **Storage**: JSON string in SQLite/PostgreSQL

## 🔐 Security

- ตรวจสอบ file type ก่อนอัพโหลด
- จำกัดขนาดไฟล์
- Sanitize URL input
- Rate limiting on API endpoints

## 📈 Monitoring

ดูสถิติใน `/dashboard/rag-management`:
- จำนวนเอกสารทั้งหมด
- เอกสารที่ประมวลผลแล้ว
- จำนวน Chunks ทั้งหมด
- สถานะการประมวลผล

## 🚨 Troubleshooting

### ไฟล์ไม่สามารถอัพโหลดได้
- ตรวจสอบ file type (.pdf, .docx, .xlsx)
- ตรวจสอบขนาดไฟล์ไม่เกิน limit

### Chatbot ตอบไม่ตรงคำถาม
- เพิ่มจำนวน chunks (topK)
- ปรับ chunk size และ overlap
- เพิ่มข้อมูลใน Q&A database

### Embeddings ช้า
- ใช้ GPU ถ้ามี
- ลด chunk size
- Process แบบ batch

## 🎯 Next Steps

1. เพิ่ม LLM integration (OpenAI, Claude) สำหรับ answer generation
2. เพิ่ม Re-ranking algorithm
3. เพิ่ม Hybrid search (keyword + semantic)
4. เพิ่ม Query expansion
5. เพิ่ม Analytics dashboard
