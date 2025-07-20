
import React, { useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { useScreenSize } from '@/hooks/use-mobile';
import OnboardingGuard from './OnboardingGuard';
import EnhancedDashboardSidebar from './EnhancedDashboardSidebar';
import DashboardHeader from './DashboardHeader';
import ModularDashboard from './ModularDashboard';
import DashboardFooter from './DashboardFooter';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';

interface BulletproofDashboardLayoutProps {
  children?: React.ReactNode;
}

const BulletproofDashboardLayout = ({ children }: BulletproofDashboardLayoutProps) => {
  const { isMobile } = useScreenSize();
  
  // Performance monitoring configuration
  const { metrics, warnings, clearWarnings } = usePerformanceMonitor({
    enableMetrics: true,
    sampleRate: 1,
    thresholds: {
      renderTime: 100,
      memoryUsage: 0.8,
      fps: 30
    }
  });

  // Start performance monitoring on mount
  useEffect(() => {
    performanceMonitor.startMonitoring();
    return () => performanceMonitor.stopMonitoring();
  }, []);

  // Log performance warnings
  useEffect(() => {
    if (warnings.length > 0) {
      warnings.forEach(warning => console.warn(`Dashboard Performance Warning: ${warning}`));
      clearWarnings();
    }
  }, [warnings, clearWarnings]);

  // Mobile Layout
  if (isMobile) {
    return performanceMonitor.measureRenderTime('MobileDashboardLayout', () => (
      <SafeComponentWrapper name="MobileDashboardLayout">
        <OnboardingGuard>
          <MobileOptimizedLayout>
            <SafeComponentWrapper 
              name="MobileDashboardContent" 
              fallback={
                <div className="p-6 min-h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🔧</div>
                    <h2 className="text-xl font-semibold mb-2">Dashboard Loading</h2>
                    <p className="text-muted-foreground">Setting up your personalized experience...</p>
                  </div>
                </div>
              }
            >
              {children || <ModularDashboard />}
            </SafeComponentWrapper>
          </MobileOptimizedLayout>
        </OnboardingGuard>
      </SafeComponentWrapper>
    ));
  }

  // Desktop Layout
  return performanceMonitor.measureRenderTime('DesktopDashboardLayout', () => (
    <SafeComponentWrapper name="BulletproofDashboardLayout">
      <OnboardingGuard>
        <SidebarProvider>
        <div className="min-h-screen flex w-full">
          {/* Bulletproof Sidebar */}
          <SafeComponentWrapper 
            name="DashboardSidebar" 
            fallback={
              <div className="w-64 bg-muted border-r flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Navigation unavailable</p>
              </div>
            }
          >
            <EnhancedDashboardSidebar />
          </SafeComponentWrapper>

          {/* Main Content Area */}
          <SidebarInset className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
            {/* Bulletproof Header */}
            <SafeComponentWrapper 
              name="DashboardHeader" 
              fallback={
                <div className="h-16 bg-background border-b flex items-center px-6">
                  <h1 className="text-lg font-semibold">TherapySync Dashboard</h1>
                </div>
              }
            >
              <DashboardHeader />
            </SafeComponentWrapper>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden">
              <SafeComponentWrapper 
                name="DashboardContent" 
                fallback={
                  <div className="p-6 min-h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🔧</div>
                      <h2 className="text-xl font-semibold mb-2">Dashboard Loading</h2>
                      <p className="text-muted-foreground">Setting up your personalized experience...</p>
                    </div>
                  </div>
                }
              >
                {children || <ModularDashboard />}
              </SafeComponentWrapper>
            </main>

            {/* Bulletproof Footer */}
            <SafeComponentWrapper 
              name="DashboardFooter" 
              fallback={
                <div className="h-12 bg-background border-t flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">TherapySync © 2024</p>
                </div>
              }
            >
              <DashboardFooter />
            </SafeComponentWrapper>
          </SidebarInset>
        </div>
      </SidebarProvider>
      </OnboardingGuard>
    </SafeComponentWrapper>
  ));
};

export default BulletproofDashboardLayout;
