
import React from 'react';
import Header from '@/components/Header';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import CommunityDashboard from '@/components/community/CommunityDashboard';

const CommunityHub = () => {
  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
          <p className="text-gray-600 mt-2">Connect with others on similar wellness journeys</p>
        </div>
        <CommunityDashboard />
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default CommunityHub;
