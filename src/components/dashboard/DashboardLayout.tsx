
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNavigation from '@/components/navigation/DashboardNavigation';
import SessionStarterWidget from './widgets/SessionStarterWidget';
import ProgressOverviewWidget from './widgets/ProgressOverviewWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import MoodTrackerWidget from './widgets/MoodTrackerWidget';
import GoalsWidget from './widgets/GoalsWidget';
import InsightsWidget from './widgets/InsightsWidget';
import TherapistWidget from './widgets/TherapistWidget';
import SessionHistoryWidget from './widgets/SessionHistoryWidget';
import SmartOnboardingGuide from '@/components/ai/SmartOnboardingGuide';
import EnhancedMoodWidget from './widgets/EnhancedMoodWidget';
import AnalyticsWidget from './widgets/AnalyticsWidget';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
      {/* Dashboard Navigation */}
      <DashboardNavigation />

      {/* Smart Onboarding Guide */}
      <SmartOnboardingGuide />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* First Column - Primary Actions */}
          <div className="space-y-6">
            <SessionStarterWidget />
            <QuickActionsWidget />
            <TherapistWidget />
          </div>

          {/* Second Column - Tracking & Progress */}
          <div className="space-y-6">
            <EnhancedMoodWidget />
            <GoalsWidget />
            <ProgressOverviewWidget />
          </div>

          {/* Third Column - Analytics & History */}
          <div className="space-y-6">
            <AnalyticsWidget />
            <SessionHistoryWidget />
          </div>

          {/* Fourth Column - Insights */}
          <div className="space-y-6">
            <InsightsWidget />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
