
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import SessionStarterWidget from './widgets/SessionStarterWidget';
import ProgressOverviewWidget from './widgets/ProgressOverviewWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import MoodTrackerWidget from './widgets/MoodTrackerWidget';
import GoalsWidget from './widgets/GoalsWidget';
import InsightsWidget from './widgets/InsightsWidget';
import TherapistWidget from './widgets/TherapistWidget';
import SessionHistoryWidget from './widgets/SessionHistoryWidget';
import EnhancedMoodWidget from './widgets/EnhancedMoodWidget';
import AnalyticsWidget from './widgets/AnalyticsWidget';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 p-6">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* First Row - Full Width Session Starter */}
        <div className="lg:col-span-3">
          <SessionStarterWidget />
        </div>

        {/* Second Row - Three Columns */}
        <div className="space-y-6">
          <EnhancedMoodWidget />
          <QuickActionsWidget />
        </div>

        <div className="space-y-6">
          <TherapistWidget />
          <AnalyticsWidget />
        </div>

        <div className="space-y-6">
          <GoalsWidget />
          <ProgressOverviewWidget />
        </div>

        {/* Third Row - Two Columns */}
        <div className="lg:col-span-2">
          <SessionHistoryWidget />
        </div>

        <div className="lg:col-span-1">
          <InsightsWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
