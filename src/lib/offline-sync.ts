interface SyncOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  table: string
  data: any
  timestamp: Date
  synced: boolean
  retryCount: number
}

interface SyncResult {
  success: boolean
  syncedOperations: number
  failedOperations: number
  conflicts: DataConflict[]
  lastSyncTime: Date
}

interface DataConflict {
  operationId: string
  localData: any
  serverData: any
  resolution: 'server_wins' | 'client_wins' | 'merge' | 'manual'
}

export class OfflineSyncManager {
  private dbName = 'SkillNexusOffline'
  private dbVersion = 1
  private db: IDBDatabase | null = null
  private syncQueue: SyncOperation[] = []

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores
        if (!db.objectStoreNames.contains('courses')) {
          const courseStore = db.createObjectStore('courses', { keyPath: 'id' })
          courseStore.createIndex('category', 'category', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('lessons')) {
          const lessonStore = db.createObjectStore('lessons', { keyPath: 'id' })
          lessonStore.createIndex('courseId', 'courseId', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'id' })
        }
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' })
        }
      }
    })
  }

  async cacheContent(content: any, type: 'course' | 'lesson' | 'progress'): Promise<void> {
    if (!this.db) await this.initialize()
    
    const transaction = this.db!.transaction([type + 's'], 'readwrite')
    const store = transaction.objectStore(type + 's')
    
    return new Promise((resolve, reject) => {
      const request = store.put(content)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCachedContent(id: string, type: 'course' | 'lesson' | 'progress'): Promise<any> {
    if (!this.db) await this.initialize()
    
    const transaction = this.db!.transaction([type + 's'], 'readonly')
    const store = transaction.objectStore(type + 's')
    
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async queueOperation(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'synced' | 'retryCount'>): Promise<void> {
    const syncOp: SyncOperation = {
      ...operation,
      id: `sync_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      synced: false,
      retryCount: 0
    }
    
    this.syncQueue.push(syncOp)
    await this.saveSyncQueue()
    
    // Try immediate sync if online
    if (navigator.onLine) {
      await this.syncToServer()
    }
  }

  async syncToServer(): Promise<SyncResult> {
    if (!navigator.onLine) {
      return {
        success: false,
        syncedOperations: 0,
        failedOperations: 0,
        conflicts: [],
        lastSyncTime: new Date()
      }
    }

    await this.loadSyncQueue()
    const unsyncedOps = this.syncQueue.filter(op => !op.synced)
    
    let syncedCount = 0
    let failedCount = 0
    const conflicts: DataConflict[] = []

    for (const operation of unsyncedOps) {
      try {
        const result = await this.syncOperation(operation)
        
        if (result.conflict) {
          conflicts.push(result.conflict)
        } else {
          operation.synced = true
          syncedCount++
        }
      } catch (error) {
        operation.retryCount++
        failedCount++
        
        // Remove operations that failed too many times
        if (operation.retryCount > 3) {
          operation.synced = true // Mark as synced to remove from queue
        }
      }
    }

    await this.saveSyncQueue()
    
    return {
      success: failedCount === 0,
      syncedOperations: syncedCount,
      failedOperations: failedCount,
      conflicts,
      lastSyncTime: new Date()
    }
  }

  private async syncOperation(operation: SyncOperation): Promise<{ success: boolean, conflict?: DataConflict }> {
    const endpoint = `/api/sync/${operation.table}`
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: operation.type,
          data: operation.data,
          timestamp: operation.timestamp
        })
      })
      
      if (response.status === 409) {
        // Conflict detected
        const serverData = await response.json()
        return {
          success: false,
          conflict: {
            operationId: operation.id,
            localData: operation.data,
            serverData: serverData.data,
            resolution: 'server_wins' // Default resolution
          }
        }
      }
      
      return { success: response.ok }
    } catch (error) {
      throw error
    }
  }

  async resolveConflict(conflict: DataConflict, resolution: 'server_wins' | 'client_wins' | 'merge'): Promise<void> {
    let resolvedData: any
    
    switch (resolution) {
      case 'server_wins':
        resolvedData = conflict.serverData
        break
      case 'client_wins':
        resolvedData = conflict.localData
        break
      case 'merge':
        resolvedData = this.mergeData(conflict.localData, conflict.serverData)
        break
    }
    
    // Update local cache with resolved data
    await this.updateLocalData(resolvedData)
    
    // Mark operation as synced
    const operation = this.syncQueue.find(op => op.id === conflict.operationId)
    if (operation) {
      operation.synced = true
      await this.saveSyncQueue()
    }
  }

  private mergeData(localData: any, serverData: any): any {
    // Simple merge strategy - server data wins for conflicts, local data for new fields
    return {
      ...localData,
      ...serverData,
      mergedAt: new Date().toISOString()
    }
  }

  private async saveSyncQueue(): Promise<void> {
    if (!this.db) return
    
    const transaction = this.db.transaction(['syncQueue'], 'readwrite')
    const store = transaction.objectStore('syncQueue')
    
    // Clear existing queue
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })
    
    // Save current queue
    for (const operation of this.syncQueue) {
      await new Promise<void>((resolve, reject) => {
        const addRequest = store.add(operation)
        addRequest.onsuccess = () => resolve()
        addRequest.onerror = () => reject(addRequest.error)
      })
    }
  }

  private async loadSyncQueue(): Promise<void> {
    if (!this.db) return
    
    const transaction = this.db.transaction(['syncQueue'], 'readonly')
    const store = transaction.objectStore('syncQueue')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        this.syncQueue = request.result
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  private async updateLocalData(data: any): Promise<void> {
    // Implementation depends on data type
    console.log('📱 Updated local data:', data)
  }

  // Background sync registration
  async registerBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready
      // Type assertion for sync API which may not be fully typed
      await (registration as any).sync.register('background-sync')
    }
  }
}

// Microlearning content chunker
export class MicrolearningManager {
  async chunkContent(content: any, targetDuration: number = 10): Promise<MicroContent[]> {
    const chunks: MicroContent[] = []
    
    // Simple chunking algorithm
    const sections = this.splitIntoSections(content)
    
    sections.forEach((section, index) => {
      chunks.push({
        id: `chunk_${content.id}_${index}`,
        title: section.title,
        content: section.content,
        duration: targetDuration,
        prerequisites: index > 0 ? [`chunk_${content.id}_${index - 1}`] : [],
        downloadSize: this.estimateSize(section.content),
        offlineCapable: true,
        type: 'microlearning'
      })
    })
    
    return chunks
  }

  private splitIntoSections(content: any): any[] {
    // Mock implementation - split content into digestible chunks
    return [
      { title: 'Introduction', content: content.intro },
      { title: 'Main Concept', content: content.main },
      { title: 'Practice', content: content.practice },
      { title: 'Summary', content: content.summary }
    ]
  }

  private estimateSize(content: string): number {
    // Rough estimate in KB
    return Math.ceil(content.length / 1024)
  }
}

interface MicroContent {
  id: string
  title: string
  content: any
  duration: number
  prerequisites: string[]
  downloadSize: number
  offlineCapable: boolean
  type: 'microlearning'
}