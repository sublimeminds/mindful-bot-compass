import React from 'react';
import { Routes, Route } from "react-router-dom";
import { PageErrorBoundary } from "@/components/bulletproof/PageErrorBoundary";

// Public Layout wrapper for marketing/public pages
import PageLayout from "@/components/layout/PageLayout";

// Dashboard Layout wrapper for authenticated user pages  
import BulletproofDashboardLayout from "@/components/dashboard/BulletproofDashboardLayout";

// Public Pages (should use PageLayout - header + footer)
import Index from "../pages/Index";
import GetStarted from "../pages/GetStarted";
import EnhancedAuth from "../pages/EnhancedAuth";
import Auth from "../pages/Auth";
import VoiceTechnology from "../pages/VoiceTechnology";
import CulturalAIFeatures from "../pages/CulturalAIFeatures";
import FeaturesOverview from "../pages/FeaturesOverview";
import HowItWorks from "../pages/HowItWorks";
import FeaturesShowcase from "../pages/FeaturesShowcase";
import CrisisSupport from "../pages/CrisisSupport";
import Pricing from "../pages/Pricing";
import CommunityFeatures from "../pages/CommunityFeatures";
import TherapyTypes from "../pages/TherapyTypes";
import TherapySyncAI from "../pages/TherapySyncAI";
import AIArchitecture from "../pages/AIArchitecture";
import TherapistDiscovery from "../pages/TherapistDiscovery";
import Community from "../pages/Community";
import Features from "../pages/Features";
import FAQAndBlog from "../pages/FAQAndBlog";

// Dashboard Pages (should use BulletproofDashboardLayout - sidebar)
import Dashboard from "../pages/Dashboard";
import EnhancedOnboardingPage from "../pages/EnhancedOnboardingPage";
import OnboardingPage from "../pages/OnboardingPage";
import Onboarding from "../pages/Onboarding";
import GoalsPage from "../pages/GoalsPage";
import Goals from "../pages/Goals";
import MoodTracker from "../pages/MoodTracker";
import AdvancedAnalytics from "../pages/AdvancedAnalytics";
import AIPersonalizationDashboard from "../pages/AIPersonalizationDashboard";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import VoiceSettings from "../pages/VoiceSettings";
import Billing from "../pages/Billing";
import Sessions from "../pages/Sessions";
import NotificationsPage from "../pages/NotificationsPage";
import TherapyPlan from "../pages/TherapyPlan";
import ProgressOverview from "../pages/ProgressOverview";
import Subscription from "../pages/Subscription";
import TherapyChatPage from "../pages/TherapyChatPage";
import UnifiedTherapyChat from '@/components/chat/UnifiedTherapyChat';
import TherapistHub from '@/components/therapist/TherapistHub';
import AIPersonalizationHub from '@/components/ai/AIPersonalizationHub';
import AnalyticsPage from '../pages/AnalyticsPage';
import PersonalizationSettingsPage from '../pages/PersonalizationSettingsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
import NotFound from "../pages/NotFound";

// Component to wrap public pages
const PublicPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <PageLayout>{children}</PageLayout>
);

// Component to wrap dashboard pages
const DashboardPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <BulletproofDashboardLayout>{children}</BulletproofDashboardLayout>
);

const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC PAGES - Use PageLayout (Header + Footer) */}
      
      {/* Core Public Routes */}
      <Route path="/" element={
        <PageErrorBoundary pageName="Home">
          <Index />
        </PageErrorBoundary>
      } />
      
      <Route path="/get-started" element={
        <PageErrorBoundary pageName="Get Started">
          <PublicPageWrapper><GetStarted /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      {/* Auth Routes */}
      <Route path="/auth" element={
        <PageErrorBoundary pageName="Authentication">
          <EnhancedAuth />
        </PageErrorBoundary>
      } />
      <Route path="/auth-old" element={
        <PageErrorBoundary pageName="Authentication (Legacy)">
          <Auth />
        </PageErrorBoundary>
      } />
      
      {/* Marketing/Feature Pages */}
      <Route path="/voice-technology" element={
        <PageErrorBoundary pageName="Voice Technology">
          <VoiceTechnology />
        </PageErrorBoundary>
      } />
      
      <Route path="/cultural-ai-features" element={
        <PageErrorBoundary pageName="Cultural AI Features">
          <PublicPageWrapper><CulturalAIFeatures /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      <Route path="/features" element={
        <PageErrorBoundary pageName="Features">
          <Features />
        </PageErrorBoundary>
      } />
      
      <Route path="/features-overview" element={
        <PageErrorBoundary pageName="Features Overview">
          <PublicPageWrapper><FeaturesOverview /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      <Route path="/how-it-works" element={
        <PageErrorBoundary pageName="How It Works">
          <PublicPageWrapper><HowItWorks /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      <Route path="/features-showcase" element={
        <PageErrorBoundary pageName="Features Showcase">
          <PublicPageWrapper><FeaturesShowcase /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      <Route path="/crisis-support" element={
        <PageErrorBoundary pageName="Crisis Support">
          <CrisisSupport />
        </PageErrorBoundary>
      } />
      
      <Route path="/pricing" element={
        <PageErrorBoundary pageName="Pricing">
          <Pricing />
        </PageErrorBoundary>
      } />
      
      <Route path="/community-features" element={
        <PageErrorBoundary pageName="Community Features">
          <PublicPageWrapper><CommunityFeatures /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-types" element={
        <PageErrorBoundary pageName="Therapy Types">
          <PublicPageWrapper><TherapyTypes /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-sync-ai" element={
        <PageErrorBoundary pageName="TherapySync AI">
          <PublicPageWrapper><TherapySyncAI /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      <Route path="/therapysync-ai" element={
        <PageErrorBoundary pageName="TherapySync AI">
          <AIArchitecture />
        </PageErrorBoundary>
      } />
      
      <Route path="/ai-architecture" element={
        <PageErrorBoundary pageName="AI Architecture">
          <AIArchitecture />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapist-discovery" element={
        <PageErrorBoundary pageName="Therapist Discovery">
          <PublicPageWrapper><TherapistDiscovery /></PublicPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/community" element={
        <PageErrorBoundary pageName="Community">
          <Community />
        </PageErrorBoundary>
      } />
      
      {/* USER DASHBOARD PAGES - Use BulletproofDashboardLayout (Sidebar) */}
      
      {/* Onboarding Routes (still dashboard style for logged in users) */}
      <Route path="/onboarding" element={
        <PageErrorBoundary pageName="Onboarding">
          <EnhancedOnboardingPage />
        </PageErrorBoundary>
      } />
      <Route path="/onboarding-old" element={
        <PageErrorBoundary pageName="Onboarding (Legacy)">
          <OnboardingPage />
        </PageErrorBoundary>
      } />
      <Route path="/onboarding-legacy" element={
        <PageErrorBoundary pageName="Onboarding (Original)">
          <Onboarding />
        </PageErrorBoundary>
      } />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={
        <PageErrorBoundary pageName="Dashboard">
          <Dashboard />
        </PageErrorBoundary>
      } />
      
      <Route path="/profile" element={
        <PageErrorBoundary pageName="Profile">
          <Profile />
        </PageErrorBoundary>
      } />
      
      <Route path="/settings" element={
        <PageErrorBoundary pageName="Settings">
          <Settings />
        </PageErrorBoundary>
      } />
      
      <Route path="/voice-settings" element={
        <PageErrorBoundary pageName="Voice Settings">
          <VoiceSettings />
        </PageErrorBoundary>
      } />

      <Route path="/billing" element={
        <PageErrorBoundary pageName="Billing">
          <DashboardPageWrapper><Billing /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/sessions" element={
        <PageErrorBoundary pageName="Sessions">
          <DashboardPageWrapper><Sessions /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/notifications" element={
        <PageErrorBoundary pageName="Notifications">
          <DashboardPageWrapper><NotificationsPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/therapy-chat" element={
        <PageErrorBoundary pageName="Therapy Chat">
          <TherapyChatPage />
        </PageErrorBoundary>
      } />

      <Route path="/therapy-plan" element={
        <PageErrorBoundary pageName="Therapy Plan">
          <DashboardPageWrapper><TherapyPlan /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/progress-overview" element={
        <PageErrorBoundary pageName="Progress Overview">
          <DashboardPageWrapper><ProgressOverview /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/subscription" element={
        <PageErrorBoundary pageName="Subscription">
          <DashboardPageWrapper><Subscription /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/goals" element={
        <PageErrorBoundary pageName="Goals">
          <DashboardPageWrapper><Goals /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/mood-tracker" element={
        <PageErrorBoundary pageName="Mood Tracker">
          <DashboardPageWrapper><MoodTracker /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/advanced-analytics" element={
        <PageErrorBoundary pageName="Advanced Analytics">
          <DashboardPageWrapper><AdvancedAnalytics /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* NEW: Unified Chat System */}
      <Route path="/chat" element={
        <PageErrorBoundary pageName="Unified Therapy Chat">
          <DashboardPageWrapper><UnifiedTherapyChat /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* NEW: Therapist Hub */}
      <Route path="/therapist-hub" element={
        <PageErrorBoundary pageName="Therapist Hub">
          <DashboardPageWrapper><TherapistHub /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* NEW: AI Personalization Hub */}
      <Route path="/ai-personalization" element={
        <PageErrorBoundary pageName="AI Personalization Hub">
          <DashboardPageWrapper><AIPersonalizationHub /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Additional AI Personalization Routes */}
      <Route path="/ai-personalization/dashboard/insights" element={
        <PageErrorBoundary pageName="AI Insights">
          <DashboardPageWrapper><AIPersonalizationDashboard /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/ai-personalization/dashboard/patterns" element={
        <PageErrorBoundary pageName="AI Patterns">
          <DashboardPageWrapper><AIPersonalizationDashboard /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/ai-personalization/dashboard/recommendations" element={
        <PageErrorBoundary pageName="AI Recommendations">
          <DashboardPageWrapper><AIPersonalizationDashboard /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Goals sub-routes */}
      <Route path="/goals/active" element={
        <PageErrorBoundary pageName="Active Goals">
          <DashboardPageWrapper><Goals /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Mood Tracker sub-routes */}
      <Route path="/mood-tracker/daily" element={
        <PageErrorBoundary pageName="Daily Mood Tracker">
          <DashboardPageWrapper><MoodTracker /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Sessions sub-routes */}
      <Route path="/sessions/all" element={
        <PageErrorBoundary pageName="All Sessions">
          <DashboardPageWrapper><Sessions /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Notification Center */}
      <Route path="/notification-center" element={
        <PageErrorBoundary pageName="Notification Center">
          <DashboardPageWrapper><NotificationsPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* NEW: Enhanced Analytics */}
      <Route path="/analytics" element={
        <PageErrorBoundary pageName="Analytics">
          <DashboardPageWrapper><AnalyticsPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* NEW: Personalization Settings */}
      <Route path="/personalization-settings" element={
        <PageErrorBoundary pageName="Personalization Settings">
          <DashboardPageWrapper><PersonalizationSettingsPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Mood Tracking - Enhanced Route */}
      <Route path="/mood-tracking" element={
        <PageErrorBoundary pageName="Mood Tracking">
          <DashboardPageWrapper><MoodTracker /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* NEW: Integrations */}
      <Route path="/integrations" element={
        <PageErrorBoundary pageName="Integrations">
          <DashboardPageWrapper><IntegrationsPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* All other dashboard routes would go here with DashboardPageWrapper if needed */}
      
      {/* Error Pages */}
      <Route path="*" element={
        <PageErrorBoundary pageName="Not Found">
          <PublicPageWrapper><NotFound /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
    </Routes>
  );
};

export default AppRouter;
