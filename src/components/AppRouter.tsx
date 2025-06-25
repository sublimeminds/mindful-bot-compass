
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/AdminUsers';
import AdminAI from '@/pages/AdminAI';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminContent from '@/pages/AdminContent';
import AdminSystem from '@/pages/AdminSystem';
import AdminPerformance from '@/pages/AdminPerformance';
import AdminCrisisManagement from '@/pages/AdminCrisisManagement';
import AdminIntegrations from '@/pages/AdminIntegrations';
import TherapySyncAI from '@/pages/TherapySyncAI';
import SessionHistory from '@/pages/SessionHistory';
import Analytics from '@/pages/Analytics';
import EnhancedMonitoringPage from '@/pages/EnhancedMonitoringPage';
import MoodTracking from '@/pages/MoodTracking';
import Goals from '@/pages/Goals';
import NotebookPage from '@/pages/NotebookPage';
import Profile from '@/pages/Profile';
import Plans from '@/pages/Plans';
import Community from '@/pages/Community';
import Techniques from '@/pages/Techniques';
import TechniqueSession from '@/pages/TechniqueSession';
import TherapistMatching from '@/pages/TherapistMatching';
import TherapistProfiles from '@/pages/TherapistProfiles';
import CrisisResources from '@/pages/CrisisResources';
import CrisisManagement from '@/pages/CrisisManagement';
import Help from '@/pages/Help';
import HelpArticles from '@/pages/HelpArticles';
import HelpArticleDetail from '@/pages/HelpArticleDetail';
import FAQ from '@/pages/FAQ';
import Contact from '@/pages/Contact';
import SmartScheduling from '@/pages/SmartScheduling';
import NotificationSettings from '@/pages/NotificationSettings';
import NotificationDashboard from '@/pages/NotificationDashboard';
import NotificationAnalytics from '@/pages/NotificationAnalytics';
import SmartTriggers from '@/pages/SmartTriggers';
import VoiceSettingsPage from '@/pages/VoiceSettingsPage';
import VoiceTechnology from '@/pages/VoiceTechnology';
import SessionAnalytics from '@/pages/SessionAnalytics';
import SettingsPage from '@/pages/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import EnhancedProfilePage from '@/pages/EnhancedProfilePage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import ComparePlans from '@/pages/ComparePlans';
import AIHub from '@/pages/AIHub';
import AIAnalytics from '@/pages/AIAnalytics';
import Onboarding from '@/pages/Onboarding';
import OnboardingPage from '@/pages/OnboardingPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import FeaturesOverview from '@/pages/FeaturesOverview';
import TherapyChat from '@/pages/TherapyChat';
import Chat from '@/pages/Chat';
import SessionPage from '@/pages/SessionPage';
import LiveSession from '@/pages/LiveSession';
import MonitoringPage from '@/pages/MonitoringPage';
import SystemHealth from '@/pages/SystemHealth';
import PerformanceDashboard from '@/pages/PerformanceDashboard';
import Integrations from '@/pages/Integrations';
import RealIntegrations from '@/pages/RealIntegrations';
import NotFound from '@/pages/NotFound';
import AdminLayout from '@/components/admin/AdminLayout';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/features" element={<FeaturesOverview />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/compare-plans" element={<ComparePlans />} />
      <Route path="/voice-technology" element={<VoiceTechnology />} />
      <Route path="/crisis-resources" element={<CrisisResources />} />
      <Route path="/help" element={<Help />} />
      <Route path="/help/articles" element={<HelpArticles />} />
      <Route path="/help/articles/:id" element={<HelpArticleDetail />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />

      {/* Protected User Routes */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard-old" element={<Dashboard />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/onboarding-flow" element={<OnboardingPage />} />
      
      {/* Therapy Routes */}
      <Route path="/therapysync-ai" element={<TherapySyncAI />} />
      <Route path="/therapy-chat" element={<TherapyChat />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/session/:id" element={<SessionPage />} />
      <Route path="/live-session" element={<LiveSession />} />
      <Route path="/session-history" element={<SessionHistory />} />
      <Route path="/session-analytics" element={<SessionAnalytics />} />
      
      {/* Wellness Routes */}
      <Route path="/mood-tracking" element={<MoodTracking />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/notebook" element={<NotebookPage />} />
      <Route path="/techniques" element={<Techniques />} />
      <Route path="/techniques/:id" element={<TechniqueSession />} />
      
      {/* Integrations Routes */}
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/real-integrations" element={<RealIntegrations />} />
      
      {/* Analytics Routes */}
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/enhanced-monitoring" element={<EnhancedMonitoringPage />} />
      <Route path="/monitoring" element={<MonitoringPage />} />
      <Route path="/ai-analytics" element={<AIAnalytics />} />
      
      {/* Community Routes */}
      <Route path="/community" element={<Community />} />
      
      {/* Therapist Routes */}
      <Route path="/therapist-matching" element={<TherapistMatching />} />
      <Route path="/therapist-profiles" element={<TherapistProfiles />} />
      
      {/* Profile & Settings Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-new" element={<ProfilePage />} />
      <Route path="/profile-enhanced" element={<EnhancedProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      
      {/* Notification Routes */}
      <Route path="/notification-settings" element={<NotificationSettings />} />
      <Route path="/notification-dashboard" element={<NotificationDashboard />} />
      <Route path="/notification-analytics" element={<NotificationAnalytics />} />
      <Route path="/smart-triggers" element={<SmartTriggers />} />
      
      {/* Crisis & Safety Routes */}
      <Route path="/crisis-management" element={<CrisisManagement />} />
      
      {/* System Routes */}
      <Route path="/smart-scheduling" element={<SmartScheduling />} />
      <Route path="/voice-settings" element={<VoiceSettingsPage />} />
      <Route path="/system-health" element={<SystemHealth />} />
      <Route path="/performance" element={<PerformanceDashboard />} />
      <Route path="/ai-hub" element={<AIHub />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="ai" element={<AdminAI />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="integrations" element={<AdminIntegrations />} />
        <Route path="system" element={<AdminSystem />} />
        <Route path="performance" element={<AdminPerformance />} />
        <Route path="crisis" element={<AdminCrisisManagement />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
