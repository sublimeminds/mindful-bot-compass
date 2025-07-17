import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageRouter } from '@/utils/languageRouting';
import AppRouter from '@/components/AppRouter';

export const CleanLanguageAwareRouter: React.FC = () => {
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
    
    // Use static SEO config to avoid circular imports
    const fallbackConfig = LanguageRouter.getCurrentPageSEO();
    
    // Small delay to ensure page is rendered
    setTimeout(() => {
      try {
        // Use static import to avoid circular dependency
        import('@/services/seoService').then(({ SEOService }) => {
          SEOService.updateMetaTags(fallbackConfig);
        });
      } catch (error) {
        console.warn('Failed to update SEO:', error);
      }
    }, 100);
  }, [location.pathname]);

  return (
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

export default CleanLanguageAwareRouter;