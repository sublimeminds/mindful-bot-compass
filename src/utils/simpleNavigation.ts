// Hook-free navigation utility to avoid React hook timing issues
export const safeNavigate = (path: string) => {
  try {
    // Try to use window.history.pushState first (preferred for SPA)
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', path);
      // Trigger a popstate event to notify React Router
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // Fallback to window.location
      window.location.href = path;
    }
  } catch (error) {
    console.error('Navigation error, using window.location fallback:', error);
    window.location.href = path;
  }
};

export const safeReplace = (path: string) => {
  try {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.replace(path);
    }
  } catch (error) {
    console.error('Replace navigation error, using window.location fallback:', error);  
    window.location.replace(path);
  }
};

// Simple SEO utility without hooks
export const updateSEO = (options: {
  title?: string;
  description?: string;
  keywords?: string;
}) => {
  if (typeof document === 'undefined') return;
  
  try {
    if (options.title) {
      document.title = options.title;
    }
    
    if (options.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', options.description);
    }
    
    if (options.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', options.keywords);
    }
  } catch (error) {
    console.warn('SEO update failed:', error);
  }
};