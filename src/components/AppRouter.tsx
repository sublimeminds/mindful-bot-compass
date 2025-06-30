import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import TherapyChat from '@/pages/TherapyChat';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Pricing from '@/pages/Pricing';
import CulturalAIFeatures from '@/pages/CulturalAIFeatures';
import HowItWorks from '@/pages/HowItWorks';
import FeaturesOverview from '@/pages/FeaturesOverview';
import FeaturesShowcase from '@/pages/FeaturesShowcase';
import VoiceTechnology from '@/pages/VoiceTechnology';
import Help from '@/pages/Help';
import Community from '@/pages/Community';
import CommunityFeatures from '@/pages/CommunityFeatures';
import CrisisResources from '@/pages/CrisisResources';
import LGBTQTherapy from '@/pages/LGBTQTherapy';
import Analytics from '@/pages/Analytics';
import Sessions from '@/pages/Sessions';
import Support from '@/pages/Support';
import CrisisSupport from '@/pages/CrisisSupport';
import Progress from '@/pages/Progress';
import OnboardingPage from '@/pages/OnboardingPage';
import CouplesTherapy from '@/pages/CouplesTherapy';
import ADHDTherapy from '@/pages/ADHDTherapy';
import TherapyTypes from '@/pages/TherapyTypes';
import Techniques from '@/pages/Techniques';
import Goals from '@/pages/Goals';
import MoodTracking from '@/pages/MoodTracking';
import Notebook from '@/pages/Notebook';
import Integrations from '@/pages/Integrations';
import AudioLibrary from '@/pages/AudioLibrary';
import AudioLibraryInfo from '@/pages/AudioLibraryInfo';
import FamilyDashboard from '@/pages/FamilyDashboard';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/landing" element={<LandingPage />} />
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
      <Route path="/features-showcase" element={<FeaturesShowcase />} />
      <Route path="/voice-technology" element={<VoiceTechnology />} />
      <Route path="/help" element={<Help />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community-features" element={<CommunityFeatures />} />
      <Route path="/crisis-resources" element={<CrisisResources />} />
      <Route path="/lgbtq-therapy" element={<LGBTQTherapy />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/support" element={<Support />} />
      <Route path="/crisis-support" element={<CrisisSupport />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/couples-therapy" element={<CouplesTherapy />} />
      <Route path="/relationship-therapy" element={<CouplesTherapy />} />
      <Route path="/adhd-therapy" element={<ADHDTherapy />} />
      <Route path="/autism-therapy" element={<ADHDTherapy />} />
      
      {/* Therapy and platform routes */}
      <Route path="/therapy-types" element={<TherapyTypes />} />
      <Route path="/techniques" element={<Techniques />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/mood-tracking" element={<MoodTracking />} />
      <Route path="/notebook" element={<Notebook />} />
      <Route path="/integrations" element={<Integrations />} />
      
      {/* Audio library routes */}
      <Route path="/audio-library" element={<AudioLibraryInfo />} />
      <Route path="/dashboard/audio-library" element={<AudioLibrary />} />
      
      {/* Family Dashboard route */}
      <Route path="/family" element={<FamilyDashboard />} />
      <Route path="/family-dashboard" element={<FamilyDashboard />} />
    </Routes>
  );
};

export default AppRouter;
