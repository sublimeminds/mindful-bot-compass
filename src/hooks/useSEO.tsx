
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SEOService } from '@/services/seoService';
import { isReactReady } from '@/utils/reactSafeGuard';

interface SEOMetaData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export const useSEO = (meta?: SEOMetaData) => {
  const location = useLocation();

  // Don't attempt to use React hooks if React isn't ready
  if (!isReactReady()) {
    console.warn('useSEO: React not ready, skipping SEO hook entirely');
    return;
  }

  try {
    React.useEffect(() => {
      // Safety check to ensure React and router context are available
      if (!location || !location.pathname) {
        console.log('useSEO: Router context not ready, skipping SEO update');
        return;
      }

      try {
        // Get page name from pathname
        const pageName = location.pathname.slice(1) || 'home';
        
        // Get default config for this page
        const pageConfig = SEOService.getPageSEOConfig(pageName);
        
        // Merge with provided meta
        const finalMeta = { ...pageConfig, ...meta };
        
        // Update meta tags
        SEOService.updateMetaTags(finalMeta);
        
        // Add organization structured data
        SEOService.addStructuredData(SEOService.generateOrganizationStructuredData());
        
        console.log('useSEO: Successfully updated SEO for page:', pageName);
      } catch (error) {
        console.error('useSEO: Error updating SEO:', error);
      }
    }, [location.pathname, meta]);
  } catch (error) {
    console.error('useSEO: React.useEffect not available:', error);
  }
};
