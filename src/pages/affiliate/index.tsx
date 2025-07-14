import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AffiliatePortal } from '@/components/affiliate/AffiliatePortal';

const AffiliateRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AffiliatePortal />} />
      <Route path="/dashboard" element={<AffiliatePortal />} />
    </Routes>
  );
};

export default AffiliateRoutes;