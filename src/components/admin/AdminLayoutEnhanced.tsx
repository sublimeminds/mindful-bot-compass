
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebarEnhanced from './AdminSidebarEnhanced';
import AdminHeaderEnhanced from './AdminHeaderEnhanced';

interface AdminLayoutEnhancedProps {
  children?: React.ReactNode;
}

const AdminLayoutEnhanced = ({ children }: AdminLayoutEnhancedProps) => {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex h-screen">
        <AdminSidebarEnhanced />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeaderEnhanced />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-gray-950">
            <div className="p-6">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutEnhanced;
