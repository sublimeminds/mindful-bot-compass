
// Enhanced Service Worker management for PWA functionality
interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

interface PWAFeatures {
  offlineSupport: boolean;
  backgroundSync: boolean;
  pushNotifications: boolean;
  caching: boolean;
}

// Extended ServiceWorkerRegistration interface for background sync
interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig = {};
  private features: PWAFeatures = {
    offlineSupport: true,
    backgroundSync: true,
    pushNotifications: true,
    caching: true
  };

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = config;
  }

  // Register enhanced service worker
  async register(swUrl: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
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

      console.log('Enhanced Service Worker registered successfully');
      return this.registration;
    } catch (error) {
      console.error('Enhanced Service Worker registration failed:', error);
      this.config.onError?.(error as Error);
      return null;
    }
  }

  // Enable specific PWA features
  async enableFeature(feature: keyof PWAFeatures): Promise<boolean> {
    this.features[feature] = true;
    
    switch (feature) {
      case 'pushNotifications':
        return await this.requestNotificationPermission();
      case 'backgroundSync':
        return this.registerBackgroundSync();
      default:
        return true;
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Register background sync
  registerBackgroundSync(): boolean {
    if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      console.log('Background sync not supported');
      return false;
    }

    console.log('Background sync registered');
    return true;
  }

  // Queue data for background sync
  async queueForSync(tag: string, data: any): Promise<void> {
    if (!this.registration) return;

    try {
      const extendedRegistration = this.registration as ExtendedServiceWorkerRegistration;
      if (extendedRegistration.sync) {
        await extendedRegistration.sync.register(tag);
        
        // Store data in IndexedDB for syncing later
        await this.storeOfflineData(tag, data);
        console.log(`Data queued for sync with tag: ${tag}`);
      } else {
        console.log('Background sync not available, storing data for manual sync');
        await this.storeOfflineData(tag, data);
      }
    } catch (error) {
      console.error('Failed to queue for sync:', error);
    }
  }

  // Store data offline using IndexedDB
  private async storeOfflineData(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MindfulAI-Offline', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline-data'], 'readwrite');
        const store = transaction.objectStore('offline-data');
        
        store.put({ id: key, data, timestamp: Date.now() });
        transaction.oncomplete = () => resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('offline-data')) {
          db.createObjectStore('offline-data', { keyPath: 'id' });
        }
      };
    });
  }

  // Get PWA capabilities
  getCapabilities(): PWAFeatures & { isStandalone: boolean; canInstall: boolean } {
    return {
      ...this.features,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      canInstall: !!(window as any).deferredPrompt
    };
  }

  // Update service worker
  async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
    }
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
}

// Enhanced Cache Management
export class CacheManager {
  private cacheName = 'mindful-ai-cache-v2';
  private apiCacheName = 'mindful-ai-api-v1';

  // Cache essential resources
  async cacheEssentials(): Promise<void> {
    const essentialUrls = [
      '/',
      '/offline.html',
      '/manifest.json',
      '/favicon.ico'
    ];

    await this.cacheResources(essentialUrls);
  }

  // Cache resources with versioning
  async cacheResources(urls: string[]): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      await cache.addAll(urls);
      console.log('Resources cached successfully');
    } catch (error) {
      console.error('Failed to cache resources:', error);
    }
  }

  // Smart cache with TTL
  async cacheWithTTL(request: Request, response: Response, ttl: number = 3600000): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      const cacheResponse = response.clone();
      
      // Add TTL header
      const headers = new Headers(cacheResponse.headers);
      headers.set('sw-cache-timestamp', Date.now().toString());
      headers.set('sw-cache-ttl', ttl.toString());
      
      const modifiedResponse = new Response(cacheResponse.body, {
        status: cacheResponse.status,
        statusText: cacheResponse.statusText,
        headers
      });
      
      await cache.put(request, modifiedResponse);
    } catch (error) {
      console.error('Failed to cache with TTL:', error);
    }
  }

  // Check if cached response is still valid
  async isCacheValid(response: Response): Promise<boolean> {
    const timestamp = response.headers.get('sw-cache-timestamp');
    const ttl = response.headers.get('sw-cache-ttl');
    
    if (!timestamp || !ttl) return true;
    
    const cacheTime = parseInt(timestamp);
    const timeToLive = parseInt(ttl);
    
    return (Date.now() - cacheTime) < timeToLive;
  }

  // Clear expired cache entries
  async clearExpiredCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response && !(await this.isCacheValid(response))) {
          await cache.delete(request);
        }
      }
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }
}

// Enhanced Offline Management
export class OfflineManager {
  private isOnline = navigator.onLine;
  private listeners = new Set<(online: boolean) => void>();
  private offlineQueue: Array<{ request: Request; timestamp: number }> = [];

  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Load offline queue from storage
    this.loadOfflineQueue();
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.notifyListeners();
    this.processOfflineQueue();
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.notifyListeners();
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  // Queue requests when offline
  queueRequest(request: Request): void {
    if (this.isOnline) return;
    
    this.offlineQueue.push({
      request: request.clone(),
      timestamp: Date.now()
    });
    
    this.saveOfflineQueue();
  }

  // Process queued requests when back online
  private async processOfflineQueue(): Promise<void> {
    if (!this.isOnline || this.offlineQueue.length === 0) return;

    const queueCopy = [...this.offlineQueue];
    this.offlineQueue = [];
    
    for (const { request } of queueCopy) {
      try {
        await fetch(request);
        console.log('Offline request processed:', request.url);
      } catch (error) {
        console.error('Failed to process offline request:', error);
        // Re-queue failed requests
        this.offlineQueue.push({ request, timestamp: Date.now() });
      }
    }
    
    this.saveOfflineQueue();
  }

  // Save/load offline queue to localStorage
  private saveOfflineQueue(): void {
    try {
      const serializedQueue = this.offlineQueue.map(item => ({
        url: item.request.url,
        method: item.request.method,
        headers: Object.fromEntries(item.request.headers.entries()),
        timestamp: item.timestamp
      }));
      
      localStorage.setItem('offline-queue', JSON.stringify(serializedQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private loadOfflineQueue(): void {
    try {
      const saved = localStorage.getItem('offline-queue');
      if (saved) {
        const serializedQueue = JSON.parse(saved);
        this.offlineQueue = serializedQueue.map((item: any) => ({
          request: new Request(item.url, {
            method: item.method,
            headers: item.headers
          }),
          timestamp: item.timestamp
        }));
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  // Subscribe to online/offline events
  subscribe(callback: (online: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Get current status
  getStatus(): { isOnline: boolean; queuedRequests: number } {
    return {
      isOnline: this.isOnline,
      queuedRequests: this.offlineQueue.length
    };
  }

  // Clean up
  destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners.clear();
  }
}

// Create singleton instances
export const serviceWorkerManager = new ServiceWorkerManager();
export const cacheManager = new CacheManager();
export const offlineManager = new OfflineManager();

// Initialize enhanced PWA features
export const initializePWA = async (config: ServiceWorkerConfig = {}) => {
  try {
    // Register enhanced service worker
    const registration = await serviceWorkerManager.register('/sw.js');
    
    if (registration) {
      // Enable PWA features
      await serviceWorkerManager.enableFeature('pushNotifications');
      await serviceWorkerManager.enableFeature('backgroundSync');
      
      // Cache essential resources
      await cacheManager.cacheEssentials();
      
      // Set up periodic cache cleanup
      setInterval(() => {
        cacheManager.clearExpiredCache();
      }, 3600000); // Every hour
      
      console.log('PWA initialized successfully');
    }
    
    return {
      serviceWorkerManager,
      cacheManager,
      offlineManager,
      capabilities: serviceWorkerManager.getCapabilities()
    };
  } catch (error) {
    console.error('Failed to initialize PWA:', error);
    return null;
  }
};

export default ServiceWorkerManager;
