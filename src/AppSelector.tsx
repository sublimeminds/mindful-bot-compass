import React from 'react';

const AppSelector: React.FC = () => {
  // Check if current path is for super admin
  const currentPath = window.location.pathname;
  const isAdminPath = currentPath.startsWith('/secure-admin-');

  if (isAdminPath) {
    // Dynamically import and render SuperAdminApp
    const SuperAdminApp = React.lazy(() => import('./SuperAdminApp'));
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-white">Loading Admin...</div>
        </div>
      }>
        <SuperAdminApp />
      </React.Suspense>
    );
  }

  // Otherwise, render the main app
  const MainApp = React.lazy(() => import('./MainApp'));
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    }>
      <MainApp />
    </React.Suspense>
  );
};

export default AppSelector;
