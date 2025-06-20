
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardLayout from './DashboardLayout';
import DashboardFooter from './DashboardFooter';

const DashboardLayoutWithSidebar = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 overflow-x-hidden">
            <DashboardLayout />
          </main>
          <DashboardFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayoutWithSidebar;
