
import { cacheService } from './cachingService';

interface IndexedDBConfig {
  dbName: string;
  version: number;
  stores: { name: string; keyPath: string; indexes?: string[] }[];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export class EnhancedCachingService {
  private db: IDBDatabase | null = null;
  private memoryCache = new Map<string, CacheEntry<any>>();
  private config: IndexedDBConfig;
  private maxMemorySize = 50; // Max items in memory cache

  constructor() {
    this.config = {
      dbName: 'MindfulAI-Cache',
      version: 1,
      stores: [
        { 
          name: 'cache', 
          keyPath: 'key',
          indexes: ['timestamp', 'priority', 'tags']
        },
        { 
          name: 'user-data', 
          keyPath: 'id',
          indexes: ['userId', 'type', 'lastAccessed']
        },
        { 
          name: 'api-cache', 
          keyPath: 'url',
          indexes: ['timestamp', 'method']
        }
      ]
    };
    
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.setupDBErrorHandling();
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        this.config.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });
            
            store.indexes?.forEach(index => {
              objectStore.createIndex(index, index);
            });
          }
        });
      };
    });
  }

  private setupDBErrorHandling(): void {
    if (this.db) {
      this.db.onerror = (event) => {
        console.error('IndexedDB error:', event);
      };
      
      this.db.onversionchange = () => {
        this.db?.close();
        this.db = null;
        // Reinitialize
        this.initDB();
      };
    }
  }

  // Multi-level get: memory -> IndexedDB -> fallback
  async get<T>(key: string, fallback?: () => Promise<T>): Promise<T | null> {
    // Level 1: Memory cache
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && this.isValid(memoryEntry)) {
      return memoryEntry.data;
    }

    // Level 2: IndexedDB
    try {
      const dbEntry = await this.getFromDB<T>(key);
      if (dbEntry && this.isValid(dbEntry)) {
        // Promote to memory cache
        this.setInMemory(key, dbEntry);
        return dbEntry.data;
      }
    } catch (error) {
      console.warn('IndexedDB read failed, using fallback:', error);
    }

    // Level 3: Fallback function
    if (fallback) {
      try {
        const data = await fallback();
        if (data !== null) {
          await this.set(key, data, { ttl: 5 * 60 * 1000 }); // 5 minutes default
        }
        return data;
      } catch (error) {
        console.error('Fallback function failed:', error);
      }
    }

    return null;
  }

  async set<T>(
    key: string, 
    data: T, 
    options: { 
      ttl?: number; 
      priority?: 'low' | 'medium' | 'high';
      tags?: string[];
    } = {}
  ): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl || 10 * 60 * 1000, // 10 minutes default
      priority: options.priority || 'medium',
      tags: options.tags || []
    };

    // Set in memory cache
    this.setInMemory(key, entry);

    // Set in IndexedDB
    try {
      await this.setInDB(key, entry);
    } catch (error) {
      console.warn('IndexedDB write failed:', error);
    }
  }

  private setInMemory<T>(key: string, entry: CacheEntry<T>): void {
    // Manage memory cache size
    if (this.memoryCache.size >= this.maxMemorySize) {
      this.evictFromMemory();
    }
    
    this.memoryCache.set(key, entry);
  }

  private evictFromMemory(): void {
    // LRU eviction based on priority and timestamp
    const entries = Array.from(this.memoryCache.entries());
    entries.sort(([, a], [, b]) => {
      // Higher priority items stay longer
      const priorityWeight = { low: 1, medium: 2, high: 3 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Older items get evicted first
      return a.timestamp - b.timestamp;
    });

    // Remove oldest, lowest priority items
    const toRemove = entries.slice(0, Math.floor(this.maxMemorySize * 0.2));
    toRemove.forEach(([key]) => this.memoryCache.delete(key));
  }

  private async getFromDB<T>(key: string): Promise<CacheEntry<T> | null> {
    if (!this.db) await this.initDB();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  private async setInDB<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put({ key, ...entry });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  // Cache warming - preload data based on usage patterns
  async warmCache(patterns: Array<{ key: string; fetcher: () => Promise<any> }>): Promise<void> {
    const promises = patterns.map(async ({ key, fetcher }) => {
      const exists = await this.get(key);
      if (!exists) {
        try {
          const data = await fetcher();
          await this.set(key, data, { priority: 'high', ttl: 30 * 60 * 1000 }); // 30 minutes
        } catch (error) {
          console.warn(`Cache warming failed for ${key}:`, error);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  // Invalidate by tags
  async invalidateByTag(tag: string): Promise<void> {
    // Clear from memory
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags.includes(tag)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear from IndexedDB
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const index = store.index('tags');
      const request = index.openCursor(IDBKeyRange.only(tag));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Get cache statistics
  async getStats(): Promise<{
    memorySize: number;
    dbSize: number;
    hitRate: number;
  }> {
    let dbSize = 0;
    
    if (this.db) {
      try {
        dbSize = await new Promise<number>((resolve) => {
          const transaction = this.db!.transaction(['cache'], 'readonly');
          const store = transaction.objectStore('cache');
          const request = store.count();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve(0);
        });
      } catch {
        dbSize = 0;
      }
    }

    return {
      memorySize: this.memoryCache.size,
      dbSize,
      hitRate: 0 // Would need to track hits/misses for real implementation
    };
  }

  // Cleanup expired entries
  async cleanup(): Promise<void> {
    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // Clean IndexedDB
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const entry = cursor.value;
          if (!this.isValid(entry)) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  destroy(): void {
    this.memoryCache.clear();
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const enhancedCacheService = new EnhancedCachingService();
