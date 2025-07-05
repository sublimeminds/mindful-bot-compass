import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import EnhancedDashboardSidebar from './EnhancedDashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardLayout from './DashboardLayout';
import DashboardFooter from './DashboardFooter';

interface BulletproofDashboardLayoutProps {
  children?: React.ReactNode;
}

const BulletproofDashboardLayout = ({ children }: BulletproofDashboardLayoutProps) => {
  return (
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
  );
};

export default BulletproofDashboardLayout;