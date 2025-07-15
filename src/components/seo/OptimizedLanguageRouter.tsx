import React, { useEffect, useState, useMemo } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageRouter } from '@/utils/languageRouting';
import { cacheService } from '@/services/cachingService';
import AppRouter from '@/components/AppRouter';
import SuperAdminRouter from '@/components/SuperAdminRouter';

export const OptimizedLanguageRouter: React.FC = () => {
  const location = useLocation();
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  // Memoize language extraction to prevent recalculation
  const { language, cleanPath } = useMemo(() => 
    LanguageRouter.extractLanguageFromPath(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    // Initialize language routing once
    if (!isLanguageReady) {
      const initLanguage = () => {
        try {
          // Use cached initialization if available
          const cached = cacheService.get('language-init');
          if (cached) {
            setIsLanguageReady(true);
            return;
          }

          LanguageRouter.initializeLanguageRouting();
          cacheService.set('language-init', true, 300000); // 5 minutes cache
          setIsLanguageReady(true);
        } catch (error) {
          console.warn('Language routing initialization failed:', error);
          setIsLanguageReady(true); // Continue with defaults
        }
      };

      // Defer initialization to prevent blocking
      const timer = setTimeout(initLanguage, 50);
      return () => clearTimeout(timer);
    }
  }, [isLanguageReady]);

  useEffect(() => {
    // Optimized SEO updates with caching and debouncing
    if (!isLanguageReady) return;

    const updateSEO = async () => {
      const pageName = cleanPath.slice(1) || 'home';
      const cacheKey = `seo-${pageName}-${language}`;
      
      try {
        // Check cache first
        const cachedSEO = cacheService.get(cacheKey);
        if (cachedSEO) {
          return;
        }

        // Use static SEO config to avoid async DB calls
        const staticConfig = LanguageRouter.getCurrentPageSEO();
        
        // Cache the config
        cacheService.set(cacheKey, staticConfig, 600000); // 10 minutes cache

        // Lazy load SEO service if needed
        const { SEOService } = await import('@/services/seoService');
        SEOService.updateMetaTags(staticConfig);
      } catch (error) {
        console.warn('SEO update failed, using defaults:', error);
      }
    };

    // Debounce SEO updates
    const timer = setTimeout(updateSEO, 100);
    return () => clearTimeout(timer);
  }, [language, cleanPath, isLanguageReady]);

  if (!isLanguageReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SuperAdminRouter />
      <Routes>
        {/* Language-prefixed routes */}
        <Route path="/:lang/*" element={<LanguagePrefixHandler />} />
        
        {/* Default English routes */}
        <Route path="/*" element={<AppRouter />} />
      </Routes>
    </>
  );
};

const LanguagePrefixHandler: React.FC = () => {
  const location = useLocation();
  
  // Memoize language extraction
  const { language, cleanPath } = useMemo(() => 
    LanguageRouter.extractLanguageFromPath(location.pathname),
    [location.pathname]
  );

  // Memoize supported languages check
  const isValidLanguage = useMemo(() => {
    const supportedLanguages = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ko', 'zh', 'ar'];
    return supportedLanguages.includes(language);
  }, [language]);
    
  if (!isValidLanguage) {
    return <Navigate to={cleanPath} replace />;
  }

  // Save language preference (cached to prevent excessive localStorage writes)
  useEffect(() => {
    const cacheKey = `lang-pref-${language}`;
    if (!cacheService.has(cacheKey)) {
      LanguageRouter.saveLanguagePreference(language);
      cacheService.set(cacheKey, true, 300000); // 5 minutes cache
    }
  }, [language]);

  return <AppRouter />;
};

export default OptimizedLanguageRouter;