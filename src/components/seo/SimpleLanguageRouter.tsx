import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AppRouter from '@/components/AppRouter';

// Lazy load SuperAdminRouter to prevent initial load blocking
const SuperAdminRouter = lazy(() => import('@/components/SuperAdminRouter'));

export const SimpleLanguageRouter: React.FC = () => {
  const location = useLocation();
  
  console.log('SimpleLanguageRouter - Current pathname:', location.pathname);
  
  // Only load SuperAdminRouter for admin paths
  const isAdminPath = location.pathname.includes('/admin') || location.pathname.includes('/secure');
  
  return (
    <>
      {isAdminPath && (
        <Suspense fallback={null}>
          <SuperAdminRouter />
        </Suspense>
      )}
      <Routes>
        {/* Language-prefixed routes */}
        <Route path="/:lang/*" element={
          <LanguagePrefixHandler />
        } />
        
        {/* Default English routes */}
        <Route path="/*" element={
          <>
            {console.log('Matching default route /*')}
            <AppRouter />
          </>
        } />
      </Routes>
    </>
  );
};

const LanguagePrefixHandler: React.FC = () => {
  const location = useLocation();
  
  console.log('LanguagePrefixHandler - pathname:', location.pathname);
  
  // Simple synchronous language extraction
  const pathParts = location.pathname.split('/').filter(Boolean);
  const potentialLanguage = pathParts[0] || 'en';
  
  console.log('Path parts:', pathParts, 'Potential language:', potentialLanguage);
  
  // Basic language validation - only treat as language if it's exactly 2 chars and supported
  const supportedLanguages = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ko', 'zh', 'ar'];
  
  // Only redirect if the first part is actually a valid language code (2 chars) and supported
  if (potentialLanguage.length === 2 && supportedLanguages.includes(potentialLanguage)) {
    console.log('Valid language detected:', potentialLanguage);
    // Save language preference without async operations
    try {
      localStorage.setItem('preferred-language', potentialLanguage);
    } catch (error) {
      // Ignore localStorage errors
    }

    return <AppRouter />;
  }

  console.log('No valid language detected, proceeding with regular AppRouter');
  // If not a valid language prefix, treat as regular path
  return <AppRouter />;
};

export default SimpleLanguageRouter;