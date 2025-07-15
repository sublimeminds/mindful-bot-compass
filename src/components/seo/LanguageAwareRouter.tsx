import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageRouter } from '@/utils/languageRouting';
import AppRouter from '@/components/AppRouter';
import SuperAdminRouter from '@/components/SuperAdminRouter';

export const LanguageAwareRouter: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // SAFE INITIALIZATION: Defer to prevent blocking app load
    const timer = setTimeout(() => {
      try {
        LanguageRouter.initializeLanguageRouting();
      } catch (error) {
        console.warn('Language routing initialization failed:', error);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update SEO for each route change
    const language = LanguageRouter.getCurrentLanguage();
    const cleanPath = LanguageRouter.getCleanPath();
    const pageName = cleanPath.slice(1) || 'home';
    
    // Update SEO meta tags for current language and page with translation support
    setTimeout(async () => {
      // Small delay to ensure page is rendered
      const { SEOService } = await import('@/services/seoService');
      
      try {
        // Try to get translated SEO config
        const seoConfig = await SEOService.getMultilingualPageSEOConfigAsync(pageName, language);
        SEOService.updateMetaTags(seoConfig);
      } catch (error) {
        // Fallback to static config
        const fallbackConfig = LanguageRouter.getCurrentPageSEO();
        SEOService.updateMetaTags(fallbackConfig);
      }
    }, 100);
  }, [location.pathname]);

  return (
    <>
      <SuperAdminRouter />
      <Routes>
        {/* Language-prefixed routes - only match actual supported languages */}
        <Route path="/en/*" element={<LanguagePrefixHandler />} />
        <Route path="/de/*" element={<LanguagePrefixHandler />} />
        <Route path="/es/*" element={<LanguagePrefixHandler />} />
        <Route path="/fr/*" element={<LanguagePrefixHandler />} />
        <Route path="/it/*" element={<LanguagePrefixHandler />} />
        <Route path="/pt/*" element={<LanguagePrefixHandler />} />
        <Route path="/ja/*" element={<LanguagePrefixHandler />} />
        <Route path="/ko/*" element={<LanguagePrefixHandler />} />
        <Route path="/zh/*" element={<LanguagePrefixHandler />} />
        <Route path="/ar/*" element={<LanguagePrefixHandler />} />
        
        {/* Default English routes */}
        <Route path="/*" element={<AppRouter />} />
      </Routes>
    </>
  );
};

const LanguagePrefixHandler: React.FC = () => {
  const location = useLocation();
  const { language, cleanPath } = LanguageRouter.extractLanguageFromPath(location.pathname);

  // Validate language and redirect if invalid
  const supportedLanguages = LanguageRouter.constructor.name ? 
    ['en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ko', 'zh', 'ar'] : [];
    
  if (!supportedLanguages.includes(language)) {
    return <Navigate to={cleanPath} replace />;
  }

  // Save language preference
  LanguageRouter.saveLanguagePreference(language);

  return <AppRouter />;
};

export default LanguageAwareRouter;