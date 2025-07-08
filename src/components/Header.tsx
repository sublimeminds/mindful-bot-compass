
import React from 'react';
import EnhancedHeader from '@/components/navigation/EnhancedHeader';
import AIInsightsHeader from '@/components/navigation/AIInsightsHeader';

// Enhanced Header component with AI insights
const Header = () => {
  return (
    <>
      <AIInsightsHeader />
      <EnhancedHeader />
    </>
  );
};

export default Header;
