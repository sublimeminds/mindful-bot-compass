// Service Worker for Push Notifications
const CACHE_NAME = 'mindful-bot-compass-v1';

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

self.addEventListener('push', event => {
  console.log('Push message received:', event);
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: '/favicon.ico',
    image: data.image,
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    tag: data.tag || 'notification',
    timestamp: data.timestamp || Date.now(),
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // If there's already a window open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise, open a new window
      if (clients.openWindow) {
        let url = '/';
        
        // Handle different actions
        if (action === 'view_session') {
          url = '/chat';
        } else if (action === 'view_progress') {
          url = '/analytics';
        } else if (data && data.url) {
          url = data.url;
        }
        
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('notificationclose', event => {
  console.log('Notification closed:', event);
  // Track notification close events if needed
});
