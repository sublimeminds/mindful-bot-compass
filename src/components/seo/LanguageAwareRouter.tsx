import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageRouter } from '@/utils/languageRouting';
import AppRouter from '@/components/AppRouter';

export const LanguageAwareRouter: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize language routing and SEO on app start
    LanguageRouter.initializeLanguageRouting();
  }, []);

  useEffect(() => {
    // Update SEO for each route change
    const language = LanguageRouter.getCurrentLanguage();
    const cleanPath = LanguageRouter.getCleanPath();
    const pageName = cleanPath.slice(1) || 'home';
    
    // Update SEO meta tags for current language and page
    const seoConfig = LanguageRouter.getCurrentPageSEO();
    setTimeout(() => {
      // Small delay to ensure page is rendered
      import('@/services/seoService').then(({ SEOService }) => {
        SEOService.updateMetaTags(seoConfig);
      });
    }, 100);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Language-prefixed routes */}
      <Route path="/:lang/*" element={<LanguagePrefixHandler />} />
      
      {/* Default English routes */}
      <Route path="/*" element={<AppRouter />} />
    </Routes>
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