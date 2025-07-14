import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EnhancedAffiliateDashboard } from '@/components/affiliate/EnhancedAffiliateDashboard';

const AffiliateRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EnhancedAffiliateDashboard />} />
      <Route path="/dashboard" element={<EnhancedAffiliateDashboard />} />
    </Routes>
  );
};

export default AffiliateRoutes;