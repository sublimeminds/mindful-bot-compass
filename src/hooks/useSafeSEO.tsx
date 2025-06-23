
import { useEffect } from 'react';

interface SEOMetaData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export const useSafeSEO = (meta?: SEOMetaData) => {
  useEffect(() => {
    // Simple SEO update without router dependency
    try {
      // Get page name from current URL
      const pageName = window.location.pathname.slice(1) || 'home';
      
      // Simple meta updates
      const finalMeta = {
        title: 'TherapySync - AI-Powered Mental Wellness Companion',
        description: 'Transform your mental wellness journey with TherapySync\'s AI-powered therapy sessions, mood tracking, and personalized insights.',
        keywords: 'AI therapy, mental health, wellness, online therapy, therapy app',
        ...meta
      };
      
      // Update title
      if (finalMeta.title) {
        document.title = finalMeta.title;
      }
      
      // Update description
      if (finalMeta.description) {
        let descElement = document.querySelector('meta[name="description"]');
        if (!descElement) {
          descElement = document.createElement('meta');
          descElement.setAttribute('name', 'description');
          document.head.appendChild(descElement);
        }
        descElement.setAttribute('content', finalMeta.description);
      }
      
      console.log('useSafeSEO: Successfully updated basic SEO for page:', pageName);
    } catch (error) {
      console.error('useSafeSEO: Error updating SEO:', error);
    }
  }, [meta]);
};
