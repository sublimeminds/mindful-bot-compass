
import React from 'react';
import { useScreenSize } from '@/hooks/use-mobile';
import MobileDashboardCards from '@/components/mobile/MobileDashboardCards';
import WelcomeWidget from './widgets/WelcomeWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import RecentActivityWidget from './widgets/RecentActivityWidget';
import ProgressOverviewWidget from './widgets/ProgressOverviewWidget';
import MoodTrackerWidget from './widgets/MoodTrackerWidget';
import TherapistAvatarWidget from './widgets/TherapistAvatarWidget';

const ModularDashboard = () => {
  const { isMobile } = useScreenSize();

  // Mobile Dashboard Layout
  if (isMobile) {
    return (
      <div className="space-y-6">
        <WelcomeWidget />
        <MobileDashboardCards />
      </div>
    );
  }

  // Desktop Dashboard Layout
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <WelcomeWidget />
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-6">
          <QuickActionsWidget />
          <ProgressOverviewWidget />
          <RecentActivityWidget />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <TherapistAvatarWidget />
          <MoodTrackerWidget />
        </div>
      </div>
    </div>
  );
};

export default ModularDashboard;
