
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import EnhancedDashboardSidebar from './EnhancedDashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardLayout from './DashboardLayout';
import DashboardFooter from './DashboardFooter';

interface DashboardLayoutWithSidebarProps {
  children?: React.ReactNode;
}

const DashboardLayoutWithSidebar = ({ children }: DashboardLayoutWithSidebarProps) => {
  return (
    <SidebarProvider collapsedWidth={64}>
      <div className="min-h-screen flex w-full therapy-gradient-bg">
        <EnhancedDashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col bg-transparent">
          <DashboardHeader />
          <main className="flex-1 overflow-x-hidden p-6 floating-particles">
            <div className="animate-scale-in">
              {children || <DashboardLayout />}
            </div>
          </main>
          <DashboardFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayoutWithSidebar;
