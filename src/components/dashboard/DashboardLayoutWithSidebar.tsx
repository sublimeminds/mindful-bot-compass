
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';
import DashboardLayout from './DashboardLayout';

const DashboardLayoutWithSidebar = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-therapy-50 to-calm-50">
        <DashboardSidebar />
        <main className="flex-1 overflow-x-hidden">
          <DashboardLayout />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayoutWithSidebar;
