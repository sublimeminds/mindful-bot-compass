
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

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Dashboard Navigation */}
      <DashboardNavigation />

      {/* Smart Onboarding Guide */}
      <SmartOnboardingGuide />

      {/* Hero Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SessionStarterWidget />
        </div>
        <div>
          <TherapistWidget />
        </div>
      </div>

      {/* Quick Stats and Actions */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <ProgressOverviewWidget />
        </div>
        <div>
          <MoodTrackerWidget />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <QuickActionsWidget />
        </div>
        <div className="lg:col-span-1">
          <GoalsWidget />
        </div>
        <div className="lg:col-span-1">
          <InsightsWidget />
        </div>
      </div>

      {/* Session History Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <SessionHistoryWidget />
        </div>
        <div>
          {/* Placeholder for future widgets */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
