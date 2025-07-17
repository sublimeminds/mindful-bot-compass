// Module cleanup utility to prevent stale module caching issues
console.log('🧹 Module cleanup utility loaded');

export const forceModuleCleanup = () => {
  try {
    // Clear any theme-related window properties
    const windowKeys = Object.keys(window);
    const themeKeys = windowKeys.filter(key => 
      key.toLowerCase().includes('theme') || 
      key.toLowerCase().includes('context') ||
      key.toLowerCase().includes('provider')
    );
    
    themeKeys.forEach(key => {
      try {
        delete (window as any)[key];
        console.log(`🧹 Cleared window.${key}`);
      } catch (e) {
        // Ignore deletion errors
      }
    });

    // Clear localStorage theme data
    try {
      localStorage.removeItem('bulletproof-theme');
      localStorage.removeItem('theme');
      console.log('🧹 Cleared theme from localStorage');
    } catch (e) {
      // Ignore storage errors
    }

    // Clear sessionStorage
    try {
      sessionStorage.clear();
      console.log('🧹 Cleared sessionStorage');
    } catch (e) {
      // Ignore storage errors
    }

    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
      console.log('🧹 Forced garbage collection');
    }

  } catch (error) {
    console.warn('🧹 Module cleanup warning:', error);
  }
};

// Export a version with cache busting for development
export const clearDevelopmentCache = () => {
  try {
    forceModuleCleanup();
    
    // Add timestamp to force module reloading
    const timestamp = Date.now();
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Cache-Control';
    meta.content = 'no-cache, no-store, must-revalidate';
    document.head.appendChild(meta);
    
    // Force reload of critical modules with cache busting
    const moduleUrls = [
      `/src/utils/BulletproofTheme.tsx?bust=${timestamp}`,
      `/src/components/ReactSafeWrapper.tsx?bust=${timestamp}`
    ];
    
    moduleUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = url;
      document.head.appendChild(link);
    });
    
    console.log('🧹 Development cache cleared with cache busting');
    
  } catch (error) {
    console.warn('🧹 Development cache clearing warning:', error);
  }
};

// Auto-execute on import in development
if (import.meta.env.DEV) {
  clearDevelopmentCache();
}