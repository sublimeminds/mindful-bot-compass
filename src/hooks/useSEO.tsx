
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOService } from '@/services/seoService';

interface SEOMetaData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export const useSEO = (meta?: SEOMetaData) => {
  const location = useLocation();

  useEffect(() => {
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
  }, [location.pathname, meta]);
};
