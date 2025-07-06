
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <EnhancedDashboardSidebar />
        <SidebarInset className="flex-1 min-h-screen">
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
            <DashboardHeader />
            <main className="flex-1 overflow-x-hidden p-6">
              {children || <DashboardLayout />}
            </main>
            <DashboardFooter />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayoutWithSidebar;
