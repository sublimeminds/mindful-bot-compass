
import React from 'react';
import Header from '@/components/Header';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import DetailedMoodTracker from '@/components/mood/DetailedMoodTracker';

const MoodTracker = () => {
  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
          <p className="text-gray-600 mt-2">Track and analyze your emotional well-being over time</p>
        </div>
        <DetailedMoodTracker />
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default MoodTracker;
