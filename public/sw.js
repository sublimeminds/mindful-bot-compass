
// Enhanced Service Worker for MindfulAI PWA
const CACHE_NAME = 'mindful-ai-v2';
const API_CACHE_NAME = 'mindful-ai-api-v1';
const OFFLINE_URL = '/offline.html';

// Resources to cache on install
const STATIC_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico'
];

// API endpoints to cache
const API_PATTERNS = [
  /\/api\//,
  /supabase\.co\/rest/,
  /supabase\.co\/auth/
];

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      }),
      createOfflinePage()
    ])
  );
  
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Handle API requests
  if (isApiRequest(request.url)) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle other requests (assets, etc.)
  event.respondWith(handleResourceRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('API request failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API failures
    return new Response(
      JSON.stringify({ 
        error: 'Offline mode', 
        message: 'This feature requires an internet connection' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('Navigation request failed, serving offline page');
    
    const cache = await caches.open(CACHE_NAME);
    const offlineResponse = await cache.match(OFFLINE_URL);
    return offlineResponse || new Response('Offline');
  }
}

// Handle resource requests with cache-first strategy
async function handleResourceRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Resource request failed:', request.url);
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

// Check if URL is an API request
function isApiRequest(url) {
  return API_PATTERNS.some(pattern => pattern.test(url));
}

// Create offline page
async function createOfflinePage() {
  const offlineHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MindfulAI - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .offline-container {
          text-align: center;
          max-width: 400px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .offline-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        h1 {
          margin: 0 0 20px 0;
          font-size: 24px;
          font-weight: 600;
        }
        p {
          margin: 0 0 30px 0;
          opacity: 0.9;
          line-height: 1.5;
        }
        .retry-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">🔄</div>
        <h1>You're Offline</h1>
        <p>MindfulAI needs an internet connection to provide the best therapy experience. Please check your connection and try again.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `;
  
  const cache = await caches.open(CACHE_NAME);
  await cache.put(OFFLINE_URL, new Response(offlineHtml, {
    headers: { 'Content-Type': 'text/html' }
  }));
}

// Enhanced push notification handling
self.addEventListener('push', event => {
  console.log('Push message received:', event);
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new notification from TherapySync',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    image: data.image,
    data: data.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    tag: data.tag || 'therapysync-notification',
    timestamp: data.timestamp || Date.now()
  };

  // Enhanced actions based on notification type
  if (data.category === 'crisis') {
    options.actions = [
      { action: 'emergency', title: 'Get Help Now', icon: '/icons/emergency.png' },
      { action: 'therapy', title: 'Start Crisis Session', icon: '/icons/therapy.png' },
      { action: 'resources', title: 'Crisis Resources', icon: '/icons/resources.png' }
    ];
    options.requireInteraction = true;
    options.vibrate = [300, 100, 300, 100, 300];
    options.tag = 'crisis-alert';
    options.renotify = true;
  } else if (data.category === 'therapy') {
    options.actions = [
      { action: 'join', title: 'Join Session', icon: '/icons/video.png' },
      { action: 'reschedule', title: 'Reschedule', icon: '/icons/calendar.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/icons/dismiss.png' }
    ];
  } else if (data.category === 'progress') {
    options.actions = [
      { action: 'celebrate', title: 'Celebrate!', icon: '/icons/celebrate.png' },
      { action: 'share', title: 'Share Progress', icon: '/icons/share.png' },
      { action: 'view', title: 'View Details', icon: '/icons/view.png' }
    ];
  } else if (data.category === 'integration') {
    options.actions = [
      { action: 'view', title: 'View Integration', icon: '/icons/integration.png' },
      { action: 'settings', title: 'Settings', icon: '/icons/settings.png' }
    ];
  } else {
    options.actions = [
      { action: 'view', title: 'View', icon: '/icons/view.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/icons/dismiss.png' }
    ];
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'TherapySync', options)
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      let url = '/dashboard';
      
      // Handle different actions based on type
      if (action === 'emergency') {
        url = '/crisis-resources';
      } else if (action === 'therapy' || action === 'join') {
        url = data.sessionId ? `/sessions/${data.sessionId}` : '/therapy-chat';
      } else if (action === 'reschedule') {
        url = '/sessions';
      } else if (action === 'celebrate' || action === 'view') {
        url = data.url || '/dashboard';
      } else if (action === 'share') {
        url = '/community';
      } else if (action === 'resources') {
        url = '/crisis-resources';
      } else if (action === 'settings') {
        url = '/integrations';
      } else if (data.url) {
        url = data.url;
      }

      // Focus existing window or open new one
      for (const client of clientList) {
        if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', event => {
  console.log('Notification closed:', event);
  // Track notification close events if needed
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'mood-sync') {
    event.waitUntil(syncMoodData());
  } else if (event.tag === 'session-sync') {
    event.waitUntil(syncSessionData());
  }
});

// Sync mood data when back online
async function syncMoodData() {
  try {
    // Get pending mood entries from IndexedDB
    const pendingEntries = await getPendingMoodEntries();
    
    for (const entry of pendingEntries) {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    }
    
    await clearPendingMoodEntries();
    console.log('Mood data synced successfully');
  } catch (error) {
    console.error('Failed to sync mood data:', error);
  }
}

// Sync session data when back online
async function syncSessionData() {
  try {
    // Get pending session data from IndexedDB
    const pendingSessions = await getPendingSessionData();
    
    for (const session of pendingSessions) {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
    }
    
    await clearPendingSessionData();
    console.log('Session data synced successfully');
  } catch (error) {
    console.error('Failed to sync session data:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingMoodEntries() {
  // Would implement IndexedDB retrieval
  return [];
}

async function clearPendingMoodEntries() {
  // Would implement IndexedDB cleanup
}

async function getPendingSessionData() {
  // Would implement IndexedDB retrieval
  return [];
}

async function clearPendingSessionData() {
  // Would implement IndexedDB cleanup
}
