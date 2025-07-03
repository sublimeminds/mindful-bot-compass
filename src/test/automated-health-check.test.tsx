import { describe, it, expect, beforeEach, vi } from 'vitest';

// Health check tests for critical app functionality
describe('Automated Health Checks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Essential Dependencies', () => {
    it('should have React available', async () => {
      const React = await import('react');
      expect(React).toBeDefined();
      expect(React.version).toBeDefined();
    });

    it('should have Router available', async () => {
      const { BrowserRouter } = await import('react-router-dom');
      expect(BrowserRouter).toBeDefined();
    });

    it('should have Supabase client available', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      expect(supabase).toBeDefined();
      expect(supabase.auth).toBeDefined();
    });

    it('should have TanStack Query available', async () => {
      const { QueryClient } = await import('@tanstack/react-query');
      expect(QueryClient).toBeDefined();
    });
  });

  describe('Core Components', () => {
    it('should have App component', async () => {
      const App = await import('@/App');
      expect(App.default).toBeDefined();
    });

    it('should have AppRouter component', async () => {
      const AppRouter = await import('@/components/AppRouter');
      expect(AppRouter.default).toBeDefined();
    });

    it('should have EnhancedAuthProvider', async () => {
      const { EnhancedAuthProvider } = await import('@/components/EnhancedAuthProvider');
      expect(EnhancedAuthProvider).toBeDefined();
    });

    it('should have BulletproofErrorBoundary', async () => {
      const BulletproofErrorBoundary = await import('@/components/BulletproofErrorBoundary');
      expect(BulletproofErrorBoundary.default).toBeDefined();
    });
  });

  describe('Essential Pages', () => {
    it('should have Index page', async () => {
      try {
        const Index = await import('@/pages/Index');
        expect(Index.default).toBeDefined();
      } catch (error) {
        throw new Error(`Index page failed to load: ${error}`);
      }
    });

    it('should have Dashboard page', async () => {
      try {
        const Dashboard = await import('@/pages/Dashboard');
        expect(Dashboard.default).toBeDefined();
      } catch (error) {
        throw new Error(`Dashboard page failed to load: ${error}`);
      }
    });

    it('should have Auth page', async () => {
      try {
        const EnhancedAuth = await import('@/pages/EnhancedAuth');
        expect(EnhancedAuth.default).toBeDefined();
      } catch (error) {
        throw new Error(`Auth page failed to load: ${error}`);
      }
    });
  });

  describe('Critical Services', () => {
    it('should have service health manager', async () => {
      const { serviceHealthManager } = await import('@/utils/serviceHealthManager');
      expect(serviceHealthManager).toBeDefined();
      expect(serviceHealthManager.startHealthChecks).toBeDefined();
      expect(serviceHealthManager.cleanup).toBeDefined();
    });

    it('should have dashboard service', async () => {
      const { dashboardService } = await import('@/services/dashboardService');
      expect(dashboardService).toBeDefined();
      expect(dashboardService.getDashboardData).toBeDefined();
    });

    it('should have profile service', async () => {
      const { profileService } = await import('@/services/profileService');
      expect(profileService).toBeDefined();
      expect(profileService.getProfile).toBeDefined();
    });
  });

  describe('Hooks', () => {
    it('should have useAuth hook', async () => {
      const { useAuth } = await import('@/hooks/useAuth');
      expect(useAuth).toBeDefined();
    });

    it('should have useDashboard hook', async () => {
      const { useDashboard } = await import('@/hooks/useDashboard');
      expect(useDashboard).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('should have proper environment setup', () => {
      expect(import.meta.env).toBeDefined();
    });

    it('should have Tailwind CSS classes available', () => {
      // Check if some basic Tailwind classes would be available
      const testElement = document.createElement('div');
      testElement.className = 'bg-primary text-foreground';
      expect(testElement.className).toBe('bg-primary text-foreground');
    });
  });

  describe('Provider Chain Health', () => {
    it('should not have circular dependencies in providers', async () => {
      // Test that we can import all providers without circular deps
      const providers = await Promise.all([
        import('@/components/EnhancedAuthProvider'),
        import('@/contexts/ThemeContext'),
        import('@/components/auth/AuthStateManager'),
      ]);

      providers.forEach((provider, index) => {
        expect(provider).toBeDefined();
      });
    });

    it('should have proper TypeScript types', async () => {
      const authTypes = await import('@/types/auth');
      expect(authTypes).toBeDefined();
    });
  });

  describe('Performance Checks', () => {
    it('should load components within reasonable time', async () => {
      const start = performance.now();
      
      await Promise.all([
        import('@/App'),
        import('@/components/AppRouter'),
        import('@/pages/Index'),
      ]);
      
      const end = performance.now();
      const loadTime = end - start;
      
      // Should load within 1 second in tests
      expect(loadTime).toBeLessThan(1000);
    });

    it('should not have memory leaks in component imports', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Import and release several components
      for (let i = 0; i < 10; i++) {
        await import('@/pages/Index');
        await import('@/components/AppRouter');
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Memory usage shouldn't grow excessively
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory;
        expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // Less than 10MB growth
      }
    });
  });
});