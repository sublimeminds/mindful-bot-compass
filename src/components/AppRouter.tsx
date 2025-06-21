
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Onboarding from '@/pages/Onboarding';
import DashboardPage from '@/pages/DashboardPage';
import CrisisResources from '@/pages/CrisisResources';
import AdminCrisisManagement from '@/pages/AdminCrisisManagement';
import Community from '@/pages/Community';
import NotebookPage from '@/pages/NotebookPage';
import SmartScheduling from '@/pages/SmartScheduling';
import Help from '@/pages/Help';
import Plans from '@/pages/Plans';
import TherapySyncAI from '@/pages/TherapySyncAI';
import TherapyChat from '@/pages/TherapyChat';
import FeaturesOverview from '@/pages/FeaturesOverview';
import EnhancedMonitoringPage from '@/pages/EnhancedMonitoringPage';
import NotFound from '@/pages/NotFound';
import HelpArticles from '@/pages/HelpArticles';
import HelpArticleDetail from '@/pages/HelpArticleDetail';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import Techniques from '@/pages/Techniques';
import TechniqueSession from '@/pages/TechniqueSession';
import SessionAnalytics from '@/pages/SessionAnalytics';
import MoodTracking from '@/pages/MoodTracking';
import Goals from '@/pages/Goals';
import Analytics from '@/pages/Analytics';
import SessionHistory from '@/pages/SessionHistory';
import TherapistProfiles from '@/pages/TherapistProfiles';
import ComparePlans from '@/pages/ComparePlans';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/techniques" element={<Techniques />} />
      <Route path="/techniques/:id" element={<TechniqueSession />} />
      <Route path="/session-analytics" element={<SessionAnalytics />} />
      <Route path="/mood-tracking" element={<MoodTracking />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/session-history" element={<SessionHistory />} />
      <Route path="/therapy" element={<TherapyChat />} />
      <Route path="/crisis-resources" element={<CrisisResources />} />
      <Route path="/admin/crisis-management" element={<AdminCrisisManagement />} />
      <Route path="/community" element={<Community />} />
      <Route path="/notebook" element={<NotebookPage />} />
      <Route path="/smart-scheduling" element={<SmartScheduling />} />
      <Route path="/help" element={<Help />} />
      <Route path="/help/articles" element={<HelpArticles />} />
      <Route path="/help/articles/:id" element={<HelpArticleDetail />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/compare-plans" element={<ComparePlans />} />
      <Route path="/therapists" element={<TherapistProfiles />} />
      <Route path="/therapysync-ai" element={<TherapySyncAI />} />
      <Route path="/features-overview" element={<FeaturesOverview />} />
      <Route path="/enhanced-monitoring" element={<EnhancedMonitoringPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
