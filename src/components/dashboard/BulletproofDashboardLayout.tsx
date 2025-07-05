import React, { useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { performanceMonitor } from '@/utils/performanceMonitor';
import EnhancedDashboardSidebar from './EnhancedDashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardLayout from './DashboardLayout';
import DashboardFooter from './DashboardFooter';
import TherapistAvatarWidget from './widgets/TherapistAvatarWidget';
import MoodTrackerWidget from './widgets/MoodTrackerWidget';
import WelcomeWidget from './widgets/WelcomeWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import RecentActivityWidget from './widgets/RecentActivityWidget';
import ProgressOverviewWidget from './widgets/ProgressOverviewWidget';

interface BulletproofDashboardLayoutProps {
  children?: React.ReactNode;
}

const BulletproofDashboardLayout = ({ children }: BulletproofDashboardLayoutProps) => {
  // Performance monitoring configuration
  const { metrics, warnings, clearWarnings } = usePerformanceMonitor({
    enableMetrics: true,
    sampleRate: 1,
    thresholds: {
      renderTime: 100, // 100ms threshold
      memoryUsage: 0.8, // 80% memory usage threshold
      fps: 30 // 30 FPS minimum
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

  // Track dashboard render performance
  useEffect(() => {
    performanceMonitor.trackMemoryUsage('BulletproofDashboardLayout');
  });

  return performanceMonitor.measureRenderTime('BulletproofDashboardLayout', () => (
    <SafeComponentWrapper name="BulletproofDashboardLayout">
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
                {children || <DashboardLayout />}
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
    </SafeComponentWrapper>
  ));
};

export default BulletproofDashboardLayout;