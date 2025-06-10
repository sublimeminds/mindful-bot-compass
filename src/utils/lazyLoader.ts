
import React, { lazy, Suspense, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentOptions {
  fallback?: React.ReactNode;
  delay?: number;
  retries?: number;
}

// Enhanced lazy loading with retry logic and better error handling
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) => {
  const {
    fallback = <ComponentSkeleton />,
    delay = 0,
    retries = 3
  } = options;

  const LazyComponent = lazy(() => 
    retryImport(importFn, retries, delay)
  );

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Retry logic for failed imports
const retryImport = async <T>(
  importFn: () => Promise<T>,
  retries: number,
  delay: number
): Promise<T> => {
  try {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Import failed, retrying... (${retries} attempts left)`);
      return retryImport(importFn, retries - 1, delay);
    }
    throw error;
  }
};

// Default loading skeleton
const ComponentSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-32 w-full" />
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);

// Preload components for better UX
export const preloadComponent = (
  importFn: () => Promise<any>
) => {
  const componentImport = importFn();
  return () => componentImport;
};

// Intersection Observer for lazy loading
export const createIntersectionLoader = (
  target: HTMLElement,
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);

  observer.observe(target);

  return () => observer.disconnect();
};

// Route-based code splitting helper
export const createRouteComponent = (
  importFn: () => Promise<{ default: ComponentType<any> }>
) => {
  return createLazyComponent(importFn, {
    fallback: <RouteLoadingSkeleton />
  });
};

const RouteLoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-4 w-full max-w-md">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

// Performance monitoring for lazy loads
class LazyLoadMonitor {
  private loadTimes = new Map<string, number>();
  private loadErrors = new Map<string, number>();

  recordLoadStart(componentName: string) {
    this.loadTimes.set(componentName, performance.now());
  }

  recordLoadEnd(componentName: string) {
    const startTime = this.loadTimes.get(componentName);
    if (startTime) {
      const loadTime = performance.now() - startTime;
      console.log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      this.loadTimes.delete(componentName);
    }
  }

  recordLoadError(componentName: string, error: Error) {
    const errorCount = this.loadErrors.get(componentName) || 0;
    this.loadErrors.set(componentName, errorCount + 1);
    console.error(`Component ${componentName} failed to load:`, error);
  }

  getMetrics() {
    return {
      loadTimes: Array.from(this.loadTimes.entries()),
      loadErrors: Array.from(this.loadErrors.entries())
    };
  }
}

export const lazyLoadMonitor = new LazyLoadMonitor();

// HOC for monitoring lazy component loads
export const withLazyLoadMonitoring = <P extends object>(
  Component: ComponentType<P>,
  componentName: string
) => {
  return (props: P) => {
    React.useEffect(() => {
      lazyLoadMonitor.recordLoadStart(componentName);
      return () => {
        lazyLoadMonitor.recordLoadEnd(componentName);
      };
    }, []);

    return React.createElement(Component, props);
  };
};

export default {
  createLazyComponent,
  preloadComponent,
  createIntersectionLoader,
  createRouteComponent,
  lazyLoadMonitor,
  withLazyLoadMonitoring
};
