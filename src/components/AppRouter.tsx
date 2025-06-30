
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import TherapyChat from '@/pages/TherapyChat';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Pricing from '@/pages/Pricing';
import CulturalAIFeatures from '@/pages/CulturalAIFeatures';
import HowItWorks from '@/pages/HowItWorks';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/therapy-chat" element={<TherapyChat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/cultural-ai-features" element={<CulturalAIFeatures />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
    </Routes>
  );
};

export default AppRouter;
