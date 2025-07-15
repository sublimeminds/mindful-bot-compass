import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AppRouter from '@/components/AppRouter';
import SuperAdminRouter from '@/components/SuperAdminRouter';

export const SimpleLanguageRouter: React.FC = () => {
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
  
  // Simple synchronous language extraction
  const pathParts = location.pathname.split('/').filter(Boolean);
  const language = pathParts[0] || 'en';
  const cleanPath = '/' + pathParts.slice(1).join('/');
  
  // Basic language validation
  const supportedLanguages = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ko', 'zh', 'ar'];
  
  if (!supportedLanguages.includes(language)) {
    return <Navigate to={cleanPath} replace />;
  }

  // Save language preference without async operations
  try {
    localStorage.setItem('preferred-language', language);
  } catch (error) {
    // Ignore localStorage errors
  }

  return <AppRouter />;
};

export default SimpleLanguageRouter;