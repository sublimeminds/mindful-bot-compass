import React from 'react';
import { Outlet } from 'react-router-dom';
import PaymentNotifications from '@/components/notifications/PaymentNotifications';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Payment notifications at the top */}
      <div className="container mx-auto px-4 pt-4">
        <PaymentNotifications />
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;