import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

// Ultra-simple SEO hook with no external dependencies
export const useSimpleSEO = ({ title, description, keywords }: SEOProps) => {
  useEffect(() => {
    // Enhanced safety checks
    if (typeof document === 'undefined') return;
    if (typeof React === 'undefined' || !React) return;
    
    try {
      // Update title
      if (title) {
        document.title = title;
      }
      
      // Update meta description
      if (description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);
      }
      
      // Update meta keywords
      if (keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords);
      }
    } catch (error) {
      // Silent fail - SEO is not critical for page loading
    }
  }, [title, description, keywords]);
};

// Export as both useSafeSEO and useBulletproofSEO for compatibility
export const useSafeSEO = useSimpleSEO;
export const useBulletproofSEO = useSimpleSEO;