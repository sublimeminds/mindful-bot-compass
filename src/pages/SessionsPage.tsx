
import React from 'react';
import SessionManager from '@/components/sessions/SessionManager';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';

const SessionsPage = () => {
  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <SessionManager />
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default SessionsPage;
