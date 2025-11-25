'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Database, Search, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { KnowledgeBaseManager, KnowledgeBase } from '@/lib/knowledge-base';

export default function RAGConverter() {
  const [kbManager] = useState(() => new KnowledgeBaseManager());
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedKB, setSelectedKB] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // สร้าง Knowledge Base ใหม่
  const createKB = useCallback((name: string, description: string) => {
    const kb = kbManager.createKnowledgeBase(name, description);
    setKnowledgeBases(kbManager.getAllKnowledgeBases());
    setSelectedKB(kb.id);
  }, [kbManager]);

  // อัพโหลดไฟล์
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!selectedKB || !files.length) return;
    
    setIsProcessing(true);
    try {
      const fileArray = Array.from(files);
      await kbManager.addMultipleFiles(selectedKB, fileArray);
      setKnowledgeBases(kbManager.getAllKnowledgeBases());
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedKB, kbManager]);

  // ค้นหา
  const handleSearch = useCallback(() => {
    if (!selectedKB || !searchQuery.trim()) return;
    
    const results = kbManager.searchKnowledgeBase(selectedKB, searchQuery);
    setSearchResults(results);
  }, [selectedKB, searchQuery, kbManager]);

  // Export KB
  const exportKB = useCallback(() => {
    if (!selectedKB) return;
    
    const data = kbManager.exportKnowledgeBase(selectedKB);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-base-${selectedKB}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedKB, kbManager]);

  // ลบ KB
  const deleteKB = useCallback((id: string) => {
    kbManager.deleteKnowledgeBase(id);
    setKnowledgeBases(kbManager.getAllKnowledgeBases());
    if (selectedKB === id) setSelectedKB('');
  }, [selectedKB, kbManager]);

  const currentKB = knowledgeBases.find(kb => kb.id === selectedKB);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🤖 RAG Knowledge Base Converter</h1>
        <p className="text-muted-foreground">แปลงไฟล์เป็น Knowledge Base สำหรับระบบ AI</p>
      </div>

      {/* สร้าง Knowledge Base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            สร้าง Knowledge Base ใหม่
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="ชื่อ Knowledge Base" 
              id="kb-name"
            />
            <Input 
              placeholder="คำอธิบาย (ไม่บังคับ)" 
              id="kb-desc"
            />
            <Button 
              onClick={() => {
                const name = (document.getElementById('kb-name') as HTMLInputElement)?.value;
                const desc = (document.getElementById('kb-desc') as HTMLInputElement)?.value;
                if (name) {
                  createKB(name, desc);
                  (document.getElementById('kb-name') as HTMLInputElement).value = '';
                  (document.getElementById('kb-desc') as HTMLInputElement).value = '';
                }
              }}
            >
              สร้าง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* เลือก Knowledge Base */}
      {knowledgeBases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Bases ที่มีอยู่</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {knowledgeBases.map((kb) => (
                <div 
                  key={kb.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedKB === kb.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedKB(kb.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{kb.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteKB(kb.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{kb.description}</p>
                  <div className="text-xs space-y-1">
                    <div>📄 เอกสาร: {kb.metadata.totalDocuments}</div>
                    <div>🧩 Chunks: {kb.metadata.totalChunks}</div>
                    <div>📊 ขนาด: {(kb.metadata.totalSize / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* อัพโหลดไฟล์ */}
      {selectedKB && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              อัพโหลดไฟล์เข้า Knowledge Base: {currentKB?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept=".txt,.md,.json,.csv,.pdf,.docx"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
                disabled={isProcessing}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {isProcessing ? 'กำลังประมวลผล...' : 'คลิกเพื่อเลือกไฟล์'}
                </p>
                <p className="text-sm text-muted-foreground">
                  รองรับ: TXT, MD, JSON, CSV, PDF, DOCX
                </p>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ค้นหา */}
      {selectedKB && currentKB && currentKB.chunks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              ค้นหาใน Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="พิมพ์คำค้นหา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>ค้นหา</Button>
              <Button variant="outline" onClick={exportKB}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">ผลการค้นหา ({searchResults.length})</h3>
                {searchResults.map((result, index) => (
                  <div key={result.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">
                        📄 {result.metadata.source} (Chunk {result.metadata.chunkIndex + 1})
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.metadata.type}
                      </span>
                    </div>
                    <p className="text-sm">{result.content}</p>
                    {result.metadata.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {result.metadata.keywords.slice(0, 5).map((keyword: string) => (
                          <span key={keyword} className="px-2 py-1 bg-primary/10 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}