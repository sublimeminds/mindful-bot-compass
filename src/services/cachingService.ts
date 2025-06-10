
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
}

class CachingService {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private metrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalRequests: 0
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      ...config
    };

    this.startCleanup();
  }

  private startCleanup() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.metrics.evictions++;
    });

    // If cache is still too large, remove least recently used items
    if (this.cache.size > this.config.maxSize) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

      const itemsToRemove = sortedEntries.slice(0, this.cache.size - this.config.maxSize);
      itemsToRemove.forEach(([key]) => {
        this.cache.delete(key);
        this.metrics.evictions++;
      });
    }
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl: ttl || this.config.defaultTTL,
      hits: 0,
      lastAccessed: now
    };

    this.cache.set(key, entry);

    // Ensure we don't exceed max size
    if (this.cache.size > this.config.maxSize) {
      this.cleanup();
    }
  }

  get<T>(key: string): T | null {
    this.metrics.totalRequests++;
    
    const entry = this.cache.get(key);
    if (!entry) {
      this.metrics.misses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.metrics.misses++;
      this.metrics.evictions++;
      return null;
    }

    entry.hits++;
    entry.lastAccessed = now;
    this.metrics.hits++;
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.metrics.evictions += this.cache.size;
  }

  getMetrics() {
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.hits / this.metrics.totalRequests) * 100 
      : 0;

    return {
      ...this.metrics,
      hitRate,
      size: this.cache.size,
      maxSize: this.config.maxSize
    };
  }

  // Smart caching for API calls
  async getCachedApiCall<T>(
    key: string, 
    apiCall: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    try {
      const data = await apiCall();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`API call failed for key ${key}:`, error);
      throw error;
    }
  }

  // Invalidate cache by pattern
  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    this.metrics.evictions += count;
    return count;
  }

  // Preload cache with data
  preload<T>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    entries.forEach(({ key, data, ttl }) => {
      this.set(key, data, ttl);
    });
  }

  // Get cache statistics
  getStatistics() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();
    
    return {
      totalEntries: entries.length,
      averageAge: entries.length > 0 
        ? entries.reduce((sum, [, entry]) => sum + (now - entry.timestamp), 0) / entries.length
        : 0,
      mostPopular: entries
        .sort(([, a], [, b]) => b.hits - a.hits)
        .slice(0, 5)
        .map(([key, entry]) => ({ key, hits: entry.hits })),
      oldestEntries: entries
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, 5)
        .map(([key, entry]) => ({ 
          key, 
          age: now - entry.timestamp,
          ttl: entry.ttl 
        }))
    };
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
  }
}

// Create singleton instance
export const cacheService = new CachingService({
  maxSize: 200,
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  cleanupInterval: 2 * 60 * 1000 // 2 minutes
});

// Specialized cache instances
export const sessionCache = new CachingService({
  maxSize: 50,
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  cleanupInterval: 5 * 60 * 1000 // 5 minutes
});

export const userCache = new CachingService({
  maxSize: 100,
  defaultTTL: 15 * 60 * 1000, // 15 minutes
  cleanupInterval: 3 * 60 * 1000 // 3 minutes
});

export const apiCache = new CachingService({
  maxSize: 150,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 60 * 1000 // 1 minute
});

export default CachingService;
