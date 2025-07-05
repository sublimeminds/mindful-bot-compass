import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { PageErrorBoundary } from './MultiLevelErrorBoundary';
import { SafeComponentWrapper } from './SafeComponentWrapper';

interface SafeRouteConfig {
  path: string;
  component: React.ComponentType<any>;
  name: string;
  requiresAuth?: boolean;
  fallback?: React.ReactNode;
  preload?: () => Promise<void>;
}

interface SafeRouterProps {
  routes: SafeRouteConfig[];
  defaultRoute?: string;
  authCheck?: () => boolean;
  loadingComponent?: React.ReactNode;
  notFoundComponent?: React.ReactNode;
}

const DefaultLoadingComponent = () => (
  <div className="flex items-center justify-center min-h-96">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

const DefaultNotFoundComponent = () => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-muted-foreground mb-4">404</h1>
      <p className="text-muted-foreground mb-4">Page not found</p>
      <button 
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      >
        Go Back
      </button>
    </div>
  </div>
);

export const SafeRouter: React.FC<SafeRouterProps> = ({
  routes,
  defaultRoute = '/',
  authCheck,
  loadingComponent = <DefaultLoadingComponent />,
  notFoundComponent = <DefaultNotFoundComponent />
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeErrors, setRouteErrors] = useState<Set<string>>(new Set());

  // Track route health
  useEffect(() => {
    console.log('SafeRouter: Navigated to', location.pathname);
  }, [location.pathname]);

  // Route error handler
  const handleRouteError = (path: string, error: Error) => {
    console.error(`SafeRouter: Route error for ${path}:`, error);
    setRouteErrors(prev => new Set([...prev, path]));
    
    // If the current route failed, redirect to default
    if (location.pathname === path && path !== defaultRoute) {
      navigate(defaultRoute, { replace: true });
    }
  };

  // Create safe route component
  const createSafeRoute = (routeConfig: SafeRouteConfig) => {
    const { component: Component, name, requiresAuth, fallback, preload } = routeConfig;
    
    return () => {
      // Auth check
      if (requiresAuth && authCheck && !authCheck()) {
        return <Navigate to="/auth" replace />;
      }

      // Route health check
      if (routeErrors.has(routeConfig.path)) {
        return (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                Route Error
              </h2>
              <p className="text-muted-foreground mb-4">
                This page encountered an error and couldn't load.
              </p>
              <button
                onClick={() => {
                  setRouteErrors(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(routeConfig.path);
                    return newSet;
                  });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        );
      }

      return (
        <PageErrorBoundary 
          name={name}
          onError={(error) => handleRouteError(routeConfig.path, error)}
          autoRetry={true}
          maxRetries={2}
        >
          <SafeComponentWrapper
            name={`${name}Page`}
            fallback={fallback}
            retryOnError={true}
            maxRetries={3}
          >
            <Suspense fallback={loadingComponent}>
              <Component />
            </Suspense>
          </SafeComponentWrapper>
        </PageErrorBoundary>
      );
    };
  };

  return (
    <Routes>
      {routes.map((routeConfig) => {
        const SafeRouteComponent = createSafeRoute(routeConfig);
        return (
          <Route
            key={routeConfig.path}
            path={routeConfig.path}
            element={<SafeRouteComponent />}
          />
        );
      })}
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={notFoundComponent} />
    </Routes>
  );
};

// Hook for safe navigation
export const useSafeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const safeNavigate = (to: string, options?: any) => {
    try {
      navigate(to, options);
    } catch (error) {
      console.error('SafeRouter: Navigation error:', error);
      // Fallback to window.location for critical navigation failures
      window.location.href = to;
    }
  };

  const goBack = () => {
    try {
      window.history.back();
    } catch (error) {
      console.error('SafeRouter: Back navigation error:', error);
      safeNavigate('/');
    }
  };

  const goForward = () => {
    try {
      window.history.forward();
    } catch (error) {
      console.error('SafeRouter: Forward navigation error:', error);
    }
  };

  return {
    navigate: safeNavigate,
    goBack,
    goForward,
    currentPath: location.pathname,
    currentSearch: location.search,
    currentHash: location.hash
  };
};