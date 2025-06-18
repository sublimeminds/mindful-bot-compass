
import React from 'react';
import Header from '@/components/Header';
import SmartScheduleDashboard from '@/components/scheduling/SmartScheduleDashboard';

const SmartScheduling = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <SmartScheduleDashboard />
        </div>
      </div>
    </>
  );
};

export default SmartScheduling;
