// EMERGENCY: Force immediate browser refresh to clear stale cache
console.log('🚨 EMERGENCY CACHE CLEAR: Forcing immediate refresh');

// Clear everything immediately
try {
  // Clear all storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
  
  // Add multiple cache-busting parameters
  const url = new URL(window.location.href);
  url.searchParams.set('v', Date.now().toString());
  url.searchParams.set('refresh', 'true');
  url.searchParams.set('cache', 'clear');
  
  // Force hard reload with cache clearing
  window.location.replace(url.toString());
  
} catch (error) {
  console.error('Emergency cache clear error:', error);
  // Fallback: simple reload
  window.location.reload();
}