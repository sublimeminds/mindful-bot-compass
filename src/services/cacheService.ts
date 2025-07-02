interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

interface CacheConfig {
  defaultTtl: number;
  maxSize: number;
  compressionThreshold: number;
}

class CacheService {
  private memoryCache = new Map<string, CacheItem<any>>();
  private config: CacheConfig = {
    defaultTtl: 300000, // 5 minutes
    maxSize: 100,
    compressionThreshold: 1024 // 1KB
  };

  // Memory Cache
  set<T>(key: string, data: T, ttl?: number, tags?: string[]): void {
    // Cleanup if at max size
    if (this.memoryCache.size >= this.config.maxSize) {
      this.cleanup();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTtl,
      tags
    };

    this.memoryCache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.memoryCache.delete(key);
  }

  // Tag-based invalidation
  invalidateByTag(tag: string): void {
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.tags && item.tags.includes(tag)) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Cleanup expired items
  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        toDelete.push(key);
      }
    }

    // If still at capacity after cleanup, remove oldest items
    if (this.memoryCache.size - toDelete.length >= this.config.maxSize) {
      const entries = Array.from(this.memoryCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const excess = (this.memoryCache.size - toDelete.length) - this.config.maxSize + 10;
      for (let i = 0; i < excess && i < entries.length; i++) {
        toDelete.push(entries[i][0]);
      }
    }

    toDelete.forEach(key => this.memoryCache.delete(key));
  }

  // LocalStorage Cache (for persistence)
  setLocal<T>(key: string, data: T, ttl?: number): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTtl
      };

      const serialized = JSON.stringify(item);
      
      // Compress if data is large
      if (serialized.length > this.config.compressionThreshold) {
        // Simple compression - in production you might use a library
        const compressed = this.compress(serialized);
        localStorage.setItem(`cache_${key}`, compressed);
        localStorage.setItem(`cache_${key}_compressed`, 'true');
      } else {
        localStorage.setItem(`cache_${key}`, serialized);
        localStorage.removeItem(`cache_${key}_compressed`);
      }
    } catch (error) {
      console.warn('Failed to cache to localStorage:', error);
    }
  }

  getLocal<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const isCompressed = localStorage.getItem(`cache_${key}_compressed`) === 'true';
      const serialized = isCompressed ? this.decompress(cached) : cached;
      const item = JSON.parse(serialized);

      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        this.deleteLocal(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to get from localStorage cache:', error);
      return null;
    }
  }

  deleteLocal(key: string): void {
    localStorage.removeItem(`cache_${key}`);
    localStorage.removeItem(`cache_${key}_compressed`);
  }

  // Simple compression (base64 encode after JSON stringify optimization)
  private compress(data: string): string {
    try {
      return btoa(data);
    } catch {
      return data;
    }
  }

  private decompress(data: string): string {
    try {
      return atob(data);
    } catch {
      return data;
    }
  }

  // Cache-aside pattern helper
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
    tags?: string[]
  ): Promise<T> {
    // Try memory cache first
    let cached = this.get<T>(key);
    if (cached !== null) return cached;

    // Try localStorage cache
    cached = this.getLocal<T>(key);
    if (cached !== null) {
      // Refresh memory cache
      this.set(key, cached, ttl, tags);
      return cached;
    }

    // Fetch fresh data
    const data = await fetcher();
    
    // Cache in both locations
    this.set(key, data, ttl, tags);
    this.setLocal(key, data, ttl);
    
    return data;
  }

  // Cache statistics
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      memoryLimit: this.config.maxSize,
      localStorageKeys: Object.keys(localStorage).filter(key => key.startsWith('cache_')).length
    };
  }

  // Clear all caches
  clear(): void {
    this.memoryCache.clear();
    
    // Clear localStorage cache
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Warm up cache with common data
  async warmUp(warmupData: { key: string; fetcher: () => Promise<any>; ttl?: number }[]): Promise<void> {
    const promises = warmupData.map(({ key, fetcher, ttl }) => 
      this.getOrSet(key, fetcher, ttl).catch(error => 
        console.warn(`Failed to warm up cache for ${key}:`, error)
      )
    );
    
    await Promise.allSettled(promises);
  }
}

export const cacheService = new CacheService();