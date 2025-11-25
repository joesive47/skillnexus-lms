import { createHash } from 'crypto';

export interface RAGDocument {
  id: string;
  content: string;
  metadata: {
    source: string;
    type: string;
    timestamp: number;
    size: number;
  };
}

export interface KnowledgeChunk {
  id: string;
  content: string;
  embedding?: number[];
  metadata: {
    documentId: string;
    chunkIndex: number;
    source: string;
    type: string;
    keywords: string[];
  };
}

export class RAGConverter {
  private chunkSize: number;
  private chunkOverlap: number;
  private maxResults: number;

  constructor() {
    this.chunkSize = parseInt(process.env.RAG_CHUNK_SIZE || '600');
    this.chunkOverlap = parseInt(process.env.RAG_CHUNK_OVERLAP || '50');
    this.maxResults = parseInt(process.env.RAG_MAX_RESULTS || '3');
  }

  // แปลงไฟล์เป็น RAG Document
  async convertFileToDocument(file: File): Promise<RAGDocument> {
    const content = await this.extractContent(file);
    const id = this.generateId(file.name + content.substring(0, 100));
    
    return {
      id,
      content,
      metadata: {
        source: file.name,
        type: file.type || this.getFileType(file.name),
        timestamp: Date.now(),
        size: file.size
      }
    };
  }

  // แยกเนื้อหาจากไฟล์
  private async extractContent(file: File): Promise<string> {
    const fileType = file.type || this.getFileType(file.name);
    
    switch (fileType) {
      case 'text/plain':
      case 'text/markdown':
        return await file.text();
      
      case 'application/json':
        const json = JSON.parse(await file.text());
        return this.extractFromJSON(json);
      
      case 'text/csv':
        return this.extractFromCSV(await file.text());
      
      default:
        return await file.text();
    }
  }

  // แยกข้อมูลจาก JSON
  private extractFromJSON(data: any): string {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      return data.map(item => this.extractFromJSON(item)).join('\n');
    }
    if (typeof data === 'object') {
      return Object.values(data).map(value => this.extractFromJSON(value)).join(' ');
    }
    return String(data);
  }

  // แยกข้อมูลจาก CSV
  private extractFromCSV(csvText: string): string {
    const lines = csvText.split('\n');
    return lines.map(line => line.split(',').join(' ')).join('\n');
  }

  // แบ่งเอกสารเป็น chunks
  chunkDocument(document: RAGDocument): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];
    const content = document.content;
    const sentences = this.splitIntoSentences(content);
    
    let currentChunk = '';
    let chunkIndex = 0;
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > this.chunkSize && currentChunk.length > 0) {
        chunks.push(this.createChunk(currentChunk, document, chunkIndex));
        
        // เก็บ overlap
        const words = currentChunk.split(' ');
        const overlapWords = words.slice(-this.chunkOverlap);
        currentChunk = overlapWords.join(' ') + ' ' + sentence;
        chunkIndex++;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(this.createChunk(currentChunk, document, chunkIndex));
    }
    
    return chunks;
  }

  // สร้าง chunk
  private createChunk(content: string, document: RAGDocument, index: number): KnowledgeChunk {
    return {
      id: this.generateId(document.id + index),
      content: content.trim(),
      metadata: {
        documentId: document.id,
        chunkIndex: index,
        source: document.metadata.source,
        type: document.metadata.type,
        keywords: this.extractKeywords(content)
      }
    };
  }

  // แยกประโยค
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // สกัดคำสำคัญ
  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\sก-๙]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  // สร้าง ID
  private generateId(input: string): string {
    return createHash('md5').update(input).digest('hex').substring(0, 16);
  }

  // ตรวจสอบประเภทไฟล์
  private getFileType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const typeMap: { [key: string]: string } = {
      'txt': 'text/plain',
      'md': 'text/markdown',
      'json': 'application/json',
      'csv': 'text/csv',
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return typeMap[ext || ''] || 'text/plain';
  }
}