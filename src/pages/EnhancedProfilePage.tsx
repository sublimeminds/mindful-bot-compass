
import React from 'react';
import Header from '@/components/Header';
import ComprehensiveProfileOverview from '@/components/profile/ComprehensiveProfileOverview';

const EnhancedProfilePage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <ComprehensiveProfileOverview />
        </div>
      </div>
    </>
  );
};

export default EnhancedProfilePage;
