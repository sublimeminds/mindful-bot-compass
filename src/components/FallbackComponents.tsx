import React from 'react';
import { Button } from '@/components/ui/button';

// Fallback header that always renders
export const FallbackHeader = () => (
  <header className="bg-white/95 backdrop-blur-md border-b border-therapy-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
            TherapySync
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    </div>
  </header>
);

// Fallback navigation that shows basic links
export const FallbackNavigation = () => (
  <nav className="bg-therapy-50 p-4">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-6">
        <a href="/" className="text-therapy-700 hover:text-therapy-800 font-medium">
          Home
        </a>
        <a href="/auth" className="text-therapy-700 hover:text-therapy-800 font-medium">
          Sign In
        </a>
      </div>
    </div>
  </nav>
);

// Loading state for any component
export const ComponentLoading = ({ name }: { name?: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-2"></div>
      <p className="text-sm text-muted-foreground">
        {name ? `Loading ${name}...` : 'Loading...'}
      </p>
    </div>
  </div>
);

// Error boundary fallback
export const ComponentError = ({ 
  error, 
  retry, 
  componentName 
}: { 
  error: Error; 
  retry?: () => void; 
  componentName?: string; 
}) => (
  <div className="p-6 text-center bg-red-50 border border-red-200 rounded-lg">
    <div className="text-red-500 mb-2">
      <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
      </svg>
    </div>
    <h3 className="text-red-700 font-medium mb-1">
      {componentName ? `${componentName} Error` : 'Component Error'}
    </h3>
    <p className="text-red-600 text-sm mb-3">{error.message}</p>
    {retry && (
      <Button 
        onClick={retry} 
        variant="outline" 
        size="sm"
        className="border-red-300 text-red-700 hover:bg-red-100"
      >
        Try Again
      </Button>
    )}
  </div>
);

// Safe wrapper for any component
export const SafeComponentWrapper = ({ 
  children, 
  fallback, 
  componentName 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
  componentName?: string; 
}) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`SafeComponentWrapper: ${componentName || 'Component'} failed:`, error);
    return fallback || <ComponentError error={error as Error} componentName={componentName} />;
  }
};