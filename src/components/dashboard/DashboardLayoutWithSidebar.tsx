
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
    <div className="min-h-screen flex w-full">
      <EnhancedDashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden">
          {children || <DashboardLayout />}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayoutWithSidebar;
