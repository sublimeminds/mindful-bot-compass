
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SessionManager from '@/components/sessions/SessionManager';

const SessionsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <SessionManager />
      </div>
    </DashboardLayout>
  );
};

export default SessionsPage;
