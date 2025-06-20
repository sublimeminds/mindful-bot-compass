
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import WelcomeWidget from './widgets/WelcomeWidget';
import QuickStatsWidget from './widgets/QuickStatsWidget';
import WeeklyOverviewWidget from './widgets/WeeklyOverviewWidget';
import RecentActivityWidget from './widgets/RecentActivityWidget';
import MoodTrendWidget from './widgets/MoodTrendWidget';
import SessionStarterWidget from './widgets/SessionStarterWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import GoalsWidget from './widgets/GoalsWidget';
import TherapistWidget from './widgets/TherapistWidget';
import AnalyticsWidget from './widgets/AnalyticsWidget';
import InsightsWidget from './widgets/InsightsWidget';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Welcome Section */}
      <WelcomeWidget />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Quick Stats and Weekly Overview */}
        <div className="space-y-6">
          <QuickStatsWidget />
          <WeeklyOverviewWidget />
        </div>

        {/* Center Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <SessionStarterWidget />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodTrendWidget />
            <GoalsWidget />
          </div>
        </div>

        {/* Right Column - Secondary Content */}
        <div className="space-y-6">
          <TherapistWidget />
          <QuickActionsWidget />
          <AnalyticsWidget />
        </div>
      </div>

      {/* Bottom Section - Activity and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityWidget />
        <InsightsWidget />
      </div>
    </div>
  );
};

export default DashboardLayout;
