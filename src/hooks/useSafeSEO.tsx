
import React from 'react';
import { isReactReady } from '@/utils/reactSafeGuard';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const useSafeSEO = ({ title, description, keywords }: SEOProps) => {
  // Don't attempt to use React hooks if React isn't ready
  if (!isReactReady()) {
    console.warn('useSafeSEO: React not ready, skipping SEO updates');
    return;
  }

  try {
    React.useEffect(() => {
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
  } catch (error) {
    console.error('useSafeSEO: React.useEffect not available:', error);
  }
};
