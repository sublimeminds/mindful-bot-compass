
import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const useSafeSEO = ({ title, description, keywords }: SEOProps) => {
  // Use bulletproof React validation before using hooks
  if (!React || typeof React.useEffect !== 'function') {
    console.warn('React useEffect not available, skipping SEO updates');
    return;
  }

  React.useEffect(() => {
    // Additional safety check inside the effect
    if (typeof document === 'undefined') {
      console.warn('Document not available, skipping SEO updates');
      return;
    }

    try {
      if (title) {
        document.title = title;
      }
      
      if (description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);
      }
      
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
      console.error('SEO update failed:', error);
    }
  }, [title, description, keywords]);
};
