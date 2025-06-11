
import React from 'react';
import SmartTriggerDashboard from '@/components/SmartTriggerDashboard';
import Header from '@/components/Header';

const SmartTriggers = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SmartTriggerDashboard />
        </div>
      </div>
    </>
  );
};

export default SmartTriggers;
