# 🚀 Setup ระบบ RAG Chatbot

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง Dependencies
```bash
npm install
```

Dependencies ใหม่ที่เพิ่ม:
- `@xenova/transformers` - Local embeddings
- `mammoth` - อ่านไฟล์ Word
- `pdf-parse` - อ่านไฟล์ PDF

### 2. อัพเดต Database Schema
```bash
npm run db:generate
npm run db:push
```

Tables ใหม่:
- `documents` - เก็บข้อมูลเอกสาร
- `document_chunks` - เก็บส่วนย่อยของเอกสารพร้อม embeddings

### 3. ทดสอบระบบ
```bash
npm run test:rag
```

### 4. รัน Development Server
```bash
npm run dev
```

## 📝 การใช้งาน

### สำหรับ Admin

1. เข้าหน้าจัดการ RAG:
   ```
   http://localhost:3000/dashboard/rag-management
   ```

2. อัพโหลดเอกสาร:
   - เลือก "ไฟล์" หรือ "URL"
   - เลือกไฟล์ PDF, Word, Excel หรือใส่ URL
   - กด "อัพโหลดและประมวลผล"
   - รอจนสถานะเป็น "completed"

3. ตรวจสอบสถิติ:
   - เอกสารทั้งหมด
   - จำนวน Chunks
   - สถานะการประมวลผล

### สำหรับ User

1. เปิด Chatbot Widget (มุมขวาล่าง)
2. พิมพ์คำถาม
3. ระบบจะ:
   - ตรวจสอบ Q&A ที่กำหนดไว้ก่อน
   - ถ้าไม่พบ จะค้นหาจากเอกสารที่อัพโหลด
   - แสดงคำตอบพร้อมแหล่งที่มา

## 🎯 ตัวอย่างการใช้งาน

### อัพโหลดไฟล์ PDF
```typescript
const formData = new FormData()
formData.append('file', pdfFile)
formData.append('courseId', 'course-123') // optional

const response = await fetch('/api/documents/upload', {
  method: 'POST',
  body: formData
})
```

### อัพโหลดจาก URL
```typescript
const formData = new FormData()
formData.append('url', 'https://example.com/article')

const response = await fetch('/api/documents/upload', {
  method: 'POST',
  body: formData
})
```

### ถามคำถาม Chatbot
```typescript
const response = await fetch('/api/chatbot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'หลักสูตรนี้เรียนอะไรบ้าง?',
    sessionId: 'session-123'
  })
})
```

## 🔧 Configuration

### Chunk Settings (ใน rag-service.ts)
```typescript
const chunkSize = 1000      // ขนาดแต่ละ chunk
const overlap = 200         // overlap ระหว่าง chunks
const topK = 3              // จำนวน chunks ที่จะใช้ตอบ
```

### Embedding Model
ใช้ `Xenova/all-MiniLM-L6-v2`:
- 384 dimensions
- ทำงานบน CPU/GPU
- ไม่ต้องเรียก API ภายนอก
- ฟรี

## 📊 ตัวอย่างข้อมูล

### Document
```json
{
  "id": "doc-123",
  "filename": "course-material.pdf",
  "fileType": "application/pdf",
  "status": "completed",
  "totalChunks": 25,
  "courseId": "course-123"
}
```

### DocumentChunk
```json
{
  "id": "chunk-456",
  "documentId": "doc-123",
  "content": "หลักสูตรนี้สอนเกี่ยวกับ...",
  "embedding": "[0.123, -0.456, ...]",
  "chunkIndex": 0
}
```

## 🚨 Troubleshooting

### ปัญหา: ไฟล์อัพโหลดไม่ได้
**แก้ไข:**
- ตรวจสอบ file type รองรับ: .pdf, .docx, .xlsx
- ตรวจสอบขนาดไฟล์
- ดู console logs

### ปัญหา: Embeddings ช้า
**แก้ไข:**
- รอให้ model โหลดครั้งแรก (ช้า)
- ครั้งต่อไปจะเร็วขึ้น (cached)
- พิจารณาใช้ GPU

### ปัญหา: Chatbot ตอบไม่ตรงคำถาม
**แก้ไข:**
- เพิ่ม topK (จำนวน chunks)
- ปรับ chunk size
- เพิ่มข้อมูลใน Q&A database

### ปัญหา: Database error
**แก้ไข:**
```bash
npm run db:generate
npm run db:push
```

## 🎨 Customization

### เปลี่ยน Embedding Model
```typescript
// ใน rag-service.ts
embedder = await pipeline(
  'feature-extraction', 
  'Xenova/paraphrase-multilingual-MiniLM-L12-v2' // รองรับภาษาไทยดีกว่า
)
```

### เพิ่ม File Types
```typescript
// ใน document-processor.ts
if (file.type === 'text/plain') {
  text = buffer.toString('utf-8')
}
```

### ปรับ Response Format
```typescript
// ใน rag-service.ts
export async function generateRAGResponse(question: string) {
  const chunks = await searchSimilarChunks(question, 3)
  
  // Custom format
  return `คำตอบ: ${chunks[0].content}\n\nอ้างอิง: ${chunks[0].source}`
}
```

## 📈 Performance Tips

1. **Batch Processing**: ประมวลผลหลายไฟล์พร้อมกัน
2. **Caching**: Cache embeddings ที่ใช้บ่อย
3. **Indexing**: เพิ่ม index ใน database
4. **Compression**: บีบอัด embeddings
5. **GPU**: ใช้ GPU สำหรับ embeddings

## 🔐 Security

- ✅ Validate file types
- ✅ Limit file size
- ✅ Sanitize URLs
- ✅ Rate limiting
- ✅ Authentication required

## 📚 เอกสารเพิ่มเติม

- [README_RAG.md](./README_RAG.md) - คู่มือโดยละเอียด
- [Xenova Transformers](https://huggingface.co/docs/transformers.js)
- [RAG Concepts](https://www.pinecone.io/learn/retrieval-augmented-generation/)

## ✅ Checklist

- [ ] ติดตั้ง dependencies
- [ ] อัพเดต database schema
- [ ] ทดสอบอัพโหลดไฟล์ PDF
- [ ] ทดสอบอัพโหลดไฟล์ Word
- [ ] ทดสอบอัพโหลดไฟล์ Excel
- [ ] ทดสอบอัพโหลดจาก URL
- [ ] ทดสอบ Chatbot ตอบคำถาม
- [ ] ตรวจสอบ embeddings ถูกสร้าง
- [ ] ตรวจสอบ similarity search ทำงาน
- [ ] Deploy to production
