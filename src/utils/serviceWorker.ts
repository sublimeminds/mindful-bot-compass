
// Service Worker registration and management
interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig = {};

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = config;
  }

  // Register service worker
  async register(swUrl: string): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register(swUrl);
      
      this.registration.addEventListener('updatefound', () => {
        const installingWorker = this.registration?.installing;
        if (installingWorker) {
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available
                this.config.onUpdate?.(this.registration!);
              } else {
                // Content is cached for offline use
                this.config.onSuccess?.(this.registration!);
              }
            }
          });
        }
      });

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      this.config.onError?.(error as Error);
      return null;
    }
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    if (this.registration) {
      return await this.registration.unregister();
    }
    return false;
  }

  // Update service worker
  async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
    }
  }

  // Check for updates
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) return false;

    await this.registration.update();
    return this.registration.waiting !== null;
  }

  // Skip waiting and activate new service worker
  skipWaiting(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Get registration status
  getStatus(): 'registered' | 'unregistered' | 'updating' | 'unknown' {
    if (!this.registration) return 'unregistered';
    if (this.registration.installing) return 'updating';
    if (this.registration.active) return 'registered';
    return 'unknown';
  }

  // Listen for service worker messages
  onMessage(callback: (event: MessageEvent) => void): () => void {
    navigator.serviceWorker.addEventListener('message', callback);
    return () => navigator.serviceWorker.removeEventListener('message', callback);
  }

  // Send message to service worker
  postMessage(message: any): void {
    if (this.registration?.active) {
      this.registration.active.postMessage(message);
    }
  }
}

// Cache management utilities
export class CacheManager {
  private cacheName = 'app-cache-v1';

  // Cache resources
  async cacheResources(urls: string[]): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      await cache.addAll(urls);
    } catch (error) {
      console.error('Failed to cache resources:', error);
    }
  }

  // Get cached response
  async getCachedResponse(request: string | Request): Promise<Response | undefined> {
    if (!('caches' in window)) return undefined;

    try {
      return await caches.match(request);
    } catch (error) {
      console.error('Failed to get cached response:', error);
      return undefined;
    }
  }

  // Clear cache
  async clearCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      await caches.delete(this.cacheName);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Get cache size
  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    try {
      const cache = await caches.open(this.cacheName);
      const requests = await cache.keys();
      return requests.length;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }
}

// Offline detection and handling
export class OfflineManager {
  private isOnline = navigator.onLine;
  private listeners = new Set<(online: boolean) => void>();

  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.notifyListeners();
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.notifyListeners();
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  // Subscribe to online/offline events
  subscribe(callback: (online: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Get current online status
  getStatus(): boolean {
    return this.isOnline;
  }

  // Clean up event listeners
  destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners.clear();
  }
}

// Background sync manager
export class BackgroundSyncManager {
  private pendingRequests = new Map<string, Request>();

  // Queue request for background sync
  queueRequest(id: string, request: Request): void {
    this.pendingRequests.set(id, request);
    
    // Store in localStorage for persistence
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: Date.now()
    };
    
    localStorage.setItem(`pending-request-${id}`, JSON.stringify(requestData));
  }

  // Process pending requests
  async processPendingRequests(): Promise<void> {
    for (const [id, request] of this.pendingRequests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          this.pendingRequests.delete(id);
          localStorage.removeItem(`pending-request-${id}`);
        }
      } catch (error) {
        console.error(`Failed to process request ${id}:`, error);
      }
    }
  }

  // Load pending requests from storage
  loadPendingRequests(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('pending-request-')) {
        const id = key.replace('pending-request-', '');
        const requestData = JSON.parse(localStorage.getItem(key) || '{}');
        
        // Recreate request object
        const request = new Request(requestData.url, {
          method: requestData.method,
          headers: requestData.headers
        });
        
        this.pendingRequests.set(id, request);
      }
    }
  }

  // Get pending request count
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

// Create singleton instances
export const serviceWorkerManager = new ServiceWorkerManager();
export const cacheManager = new CacheManager();
export const offlineManager = new OfflineManager();
export const backgroundSyncManager = new BackgroundSyncManager();

// Initialize PWA features
export const initializePWA = (config: ServiceWorkerConfig = {}) => {
  // Register service worker
  serviceWorkerManager.register('/sw.js');
  
  // Load pending background sync requests
  backgroundSyncManager.loadPendingRequests();
  
  // Process pending requests when back online
  offlineManager.subscribe((online) => {
    if (online) {
      backgroundSyncManager.processPendingRequests();
    }
  });

  return {
    serviceWorkerManager,
    cacheManager,
    offlineManager,
    backgroundSyncManager
  };
};

export default ServiceWorkerManager;
