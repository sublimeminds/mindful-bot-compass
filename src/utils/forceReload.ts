// Force reload utility to clear all caches and restart fresh
export const forceApplicationReload = () => {
  console.log('🔄 FORCING COMPLETE APPLICATION RELOAD');
  
  // Clear all possible caches
  try {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage  
    sessionStorage.clear();
    
    // Clear any module caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    
    // Add cache busting to the URL
    const url = new URL(window.location.href);
    url.searchParams.set('cache_bust', Date.now().toString());
    
    // Force hard reload
    window.location.replace(url.toString());
    
  } catch (error) {
    console.error('Cache clearing error:', error);
    // Fallback to simple reload
    window.location.reload();
  }
};

// Auto-execute in development when ThemeContext errors are detected
if (import.meta.env.DEV) {
  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (typeof message === 'string' && message.includes('ThemeContext')) {
      console.error('🚨 Detected stale ThemeContext reference - forcing reload');
      forceApplicationReload();
      return true;
    }
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    return false;
  };
}