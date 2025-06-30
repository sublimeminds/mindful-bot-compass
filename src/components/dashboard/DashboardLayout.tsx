
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomeWidget from './widgets/WelcomeWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import MoodTrackerWidget from './widgets/MoodTrackerWidget';
import SessionHistoryWidget from './widgets/SessionHistoryWidget';
import GoalsWidget from './widgets/GoalsWidget';
import AnalyticsWidget from './widgets/AnalyticsWidget';
import PremiumAudioShowcase from './PremiumAudioShowcase';
import type { User as UserType } from '@/types/user';

const DashboardLayout = () => {
  const { user } = useAuth();
  const userPlan = (user as UserType)?.subscription_plan || 'free';
  const isPremium = userPlan === 'premium' || userPlan === 'pro';

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <WelcomeWidget />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActionsWidget />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodTrackerWidget />
            <GoalsWidget />
          </div>
          <SessionHistoryWidget />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AnalyticsWidget />
          
          {/* Premium Audio Showcase */}
          <PremiumAudioShowcase />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
