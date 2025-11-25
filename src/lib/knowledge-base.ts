import { RAGDocument, KnowledgeChunk, RAGConverter } from './rag-converter';

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documents: RAGDocument[];
  chunks: KnowledgeChunk[];
  metadata: {
    createdAt: number;
    updatedAt: number;
    totalDocuments: number;
    totalChunks: number;
    totalSize: number;
  };
}

export class KnowledgeBaseManager {
  private converter: RAGConverter;
  private knowledgeBases: Map<string, KnowledgeBase> = new Map();
  private cacheSize: number;

  constructor() {
    this.converter = new RAGConverter();
    this.cacheSize = parseInt(process.env.RAG_CACHE_SIZE || '2000');
  }

  // สร้าง Knowledge Base ใหม่
  createKnowledgeBase(name: string, description: string = ''): KnowledgeBase {
    const id = this.generateId(name + Date.now());
    const kb: KnowledgeBase = {
      id,
      name,
      description,
      documents: [],
      chunks: [],
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalDocuments: 0,
        totalChunks: 0,
        totalSize: 0
      }
    };
    
    this.knowledgeBases.set(id, kb);
    return kb;
  }

  // เพิ่มไฟล์เข้า Knowledge Base
  async addFileToKnowledgeBase(kbId: string, file: File): Promise<void> {
    const kb = this.knowledgeBases.get(kbId);
    if (!kb) throw new Error('Knowledge Base not found');

    // แปลงไฟล์เป็น document
    const document = await this.converter.convertFileToDocument(file);
    
    // แบ่งเป็น chunks
    const chunks = this.converter.chunkDocument(document);
    
    // เพิ่มเข้า KB
    kb.documents.push(document);
    kb.chunks.push(...chunks);
    
    // อัพเดท metadata
    kb.metadata.updatedAt = Date.now();
    kb.metadata.totalDocuments = kb.documents.length;
    kb.metadata.totalChunks = kb.chunks.length;
    kb.metadata.totalSize += document.metadata.size;
  }

  // เพิ่มหลายไฟล์พร้อมกัน
  async addMultipleFiles(kbId: string, files: File[]): Promise<void> {
    const batchSize = parseInt(process.env.RAG_BATCH_SIZE || '10');
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(
        batch.map(file => this.addFileToKnowledgeBase(kbId, file))
      );
    }
  }

  // ค้นหาใน Knowledge Base
  searchKnowledgeBase(kbId: string, query: string): KnowledgeChunk[] {
    const kb = this.knowledgeBases.get(kbId);
    if (!kb) return [];

    const queryLower = query.toLowerCase();
    const results: Array<{ chunk: KnowledgeChunk; score: number }> = [];

    for (const chunk of kb.chunks) {
      const score = this.calculateSimilarity(queryLower, chunk.content.toLowerCase());
      const threshold = parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || '0.25');
      
      if (score > threshold) {
        results.push({ chunk, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(process.env.RAG_MAX_RESULTS || '3'))
      .map(r => r.chunk);
  }

  // คำนวณความคล้าย (Simple TF-IDF like scoring)
  private calculateSimilarity(query: string, content: string): number {
    const queryWords = query.split(/\s+/).filter(w => w.length > 2);
    const contentWords = content.split(/\s+/);
    
    let matches = 0;
    let totalWords = queryWords.length;
    
    for (const word of queryWords) {
      if (contentWords.some(cw => cw.includes(word) || word.includes(cw))) {
        matches++;
      }
    }
    
    return totalWords > 0 ? matches / totalWords : 0;
  }

  // ดึง Knowledge Base ทั้งหมด
  getAllKnowledgeBases(): KnowledgeBase[] {
    return Array.from(this.knowledgeBases.values());
  }

  // ดึง Knowledge Base ตาม ID
  getKnowledgeBase(id: string): KnowledgeBase | undefined {
    return this.knowledgeBases.get(id);
  }

  // ลบ Knowledge Base
  deleteKnowledgeBase(id: string): boolean {
    return this.knowledgeBases.delete(id);
  }

  // ลบเอกสารจาก Knowledge Base
  removeDocumentFromKB(kbId: string, documentId: string): void {
    const kb = this.knowledgeBases.get(kbId);
    if (!kb) return;

    // ลบ document
    kb.documents = kb.documents.filter(doc => doc.id !== documentId);
    
    // ลบ chunks ที่เกี่ยวข้อง
    kb.chunks = kb.chunks.filter(chunk => chunk.metadata.documentId !== documentId);
    
    // อัพเดท metadata
    kb.metadata.updatedAt = Date.now();
    kb.metadata.totalDocuments = kb.documents.length;
    kb.metadata.totalChunks = kb.chunks.length;
    kb.metadata.totalSize = kb.documents.reduce((sum, doc) => sum + doc.metadata.size, 0);
  }

  // Export Knowledge Base เป็น JSON
  exportKnowledgeBase(id: string): string {
    const kb = this.knowledgeBases.get(id);
    if (!kb) throw new Error('Knowledge Base not found');
    
    return JSON.stringify(kb, null, 2);
  }

  // Import Knowledge Base จาก JSON
  importKnowledgeBase(jsonData: string): KnowledgeBase {
    const kb: KnowledgeBase = JSON.parse(jsonData);
    this.knowledgeBases.set(kb.id, kb);
    return kb;
  }

  // สร้าง ID
  private generateId(input: string): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // ล้าง cache
  clearCache(): void {
    if (this.knowledgeBases.size > this.cacheSize) {
      const entries = Array.from(this.knowledgeBases.entries());
      const toKeep = entries.slice(-Math.floor(this.cacheSize * 0.8));
      this.knowledgeBases.clear();
      toKeep.forEach(([id, kb]) => this.knowledgeBases.set(id, kb));
    }
  }
}