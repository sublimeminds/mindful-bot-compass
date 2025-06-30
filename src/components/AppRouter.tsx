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
import FeaturesOverview from '@/pages/FeaturesOverview';
import VoiceTechnology from '@/pages/VoiceTechnology';
import Help from '@/pages/Help';
import Community from '@/pages/Community';
import CrisisResources from '@/pages/CrisisResources';
import LGBTQTherapy from '@/pages/LGBTQTherapy';
import Analytics from '@/pages/Analytics';
import Sessions from '@/pages/Sessions';
import Support from '@/pages/Support';
import CrisisSupport from '@/pages/CrisisSupport';
import Progress from '@/pages/Progress';
import OnboardingPage from '@/pages/OnboardingPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/therapy-chat" element={<TherapyChat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/cultural-ai-features" element={<CulturalAIFeatures />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/features-overview" element={<FeaturesOverview />} />
      <Route path="/voice-technology" element={<VoiceTechnology />} />
      <Route path="/help" element={<Help />} />
      <Route path="/community" element={<Community />} />
      <Route path="/crisis-resources" element={<CrisisResources />} />
      <Route path="/lgbtq-therapy" element={<LGBTQTherapy />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/support" element={<Support />} />
      <Route path="/crisis-support" element={<CrisisSupport />} />
      <Route path="/progress" element={<Progress />} />
    </Routes>
  );
};

export default AppRouter;
