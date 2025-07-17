
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

  // Simplified SEO hook - disabled to prevent memory issues
  React.useEffect(() => {
    if (!location?.pathname) return;
    
    // Basic document title only
    const pageName = location.pathname.slice(1) || 'home';
    const title = meta?.title || `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - MentalQ AI`;
    document.title = title;
    
    // Basic meta description
    if (meta?.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', meta.description);
      }
    }
  }, [location?.pathname, meta?.title, meta?.description]);
};
