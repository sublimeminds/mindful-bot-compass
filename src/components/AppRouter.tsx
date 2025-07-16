import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { PageErrorBoundary } from "@/components/bulletproof/PageErrorBoundary";

// Public Layout wrapper for marketing/public pages
import PageLayout from "@/components/layout/PageLayout";

// Dashboard Layout wrapper for authenticated user pages  
import BulletproofDashboardLayout from "@/components/dashboard/BulletproofDashboardLayout";

// Admin Layout wrapper for admin pages
import AdminLayoutEnhanced from "@/components/admin/AdminLayoutEnhanced";

// Public Pages (should use PageLayout - header + footer)
import Index from "../pages/Index";
import GetStarted from "../pages/GetStarted";
import EnhancedAuth from "../pages/EnhancedAuth";
import Auth from "../pages/Auth";
import EmailPinAuthPage from "../pages/EmailPinAuthPage";
import VoiceTechnology from "../pages/VoiceTechnology";
import ApiDocs from "../pages/ApiDocs";
import MobileApps from "../pages/MobileApps";
import Reports from "../pages/Reports";
import DataExport from "../pages/DataExport";
import CustomIntegrations from "../pages/CustomIntegrations";
import Individuals from "../pages/solutions/Individuals";
import Families from "../pages/solutions/Families";
import Providers from "../pages/solutions/Providers";
import Organizations from "../pages/solutions/Organizations";
import FamilyFeaturesInfo from "../pages/FamilyFeaturesInfo";
import CulturalAIFeatures from "../pages/CulturalAIFeatures";
import FeaturesOverview from "../pages/FeaturesOverview";
import HowItWorks from "../pages/HowItWorks";
import FeaturesShowcase from "../pages/FeaturesShowcase";
import CrisisSupport from "../pages/CrisisSupport";
import Pricing from "../pages/Pricing";
import BreathingExercisesPage from "../pages/BreathingExercisesPage";
import MeditationLibraryPage from "../pages/MeditationLibraryPage";
import PricingPage from "../pages/PricingPage";
import CommunityFeatures from "../pages/CommunityFeatures";
import TherapyTypes from "../pages/TherapyTypes";
import TherapySyncAI from "../pages/TherapySyncAI";
import AIArchitecture from "../pages/AIArchitecture";
import TherapistDiscovery from "../pages/TherapistDiscovery";
import Community from "../pages/Community";
import Features from "../pages/Features";
import FAQAndBlog from "../pages/FAQAndBlog";
import { AffiliateProgramPage } from "../pages/AffiliateProgramPage";
import AffiliateRoutes from "../pages/affiliate";
// AI monitoring components moved to admin AI section

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
import BillingPage from "../pages/BillingPage";
import Sessions from "../pages/Sessions";
import NotificationsPage from "../pages/NotificationsPage";
import NotificationsInbox from "../pages/NotificationsInbox";
import TherapyPlanPage from "../pages/TherapyPlanPage";
import ProgressOverview from "../pages/ProgressOverview";
import Subscription from "../pages/Subscription";
import AccountBilling from "../pages/AccountBilling";
import TherapySessionPage from "../pages/TherapySessionPage";
import QuickChatPage from "../pages/QuickChatPage";
import UnifiedTherapyChat from '@/components/chat/UnifiedTherapyChat';
import TherapistHub from '@/components/therapist/TherapistHub';
import AIPersonalizationHub from '@/components/ai/AIPersonalizationHub';
import AnalyticsPage from '../pages/AnalyticsPage';
import PersonalizationSettingsPage from '../pages/PersonalizationSettingsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
import NotFound from "../pages/NotFound";
import FamilyDashboard from "../pages/FamilyDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import AdminAI from "../pages/AdminAI";
import AdminAnalytics from "../pages/AdminAnalytics";
import AdminContent from "../pages/AdminContent";
import AdminTranslations from "../pages/AdminTranslations";
import AdminTherapy from "../pages/AdminTherapyPage";
import FamilyFeaturesPage from "../pages/FamilyFeaturesPage";
import ContentLibrary from "../pages/ContentLibrary";
import CompliancePage from '../components/compliance/CompliancePage';
import PrivacyDashboard from '../components/compliance/PrivacyDashboard';
import AdaptiveSystems from "../pages/AdaptiveSystems";
import SessionAnalytics from "../pages/SessionAnalytics";
import AIPersonalization from "../pages/AIPersonalization";
import AIHub from "../pages/AIHub";

// Component to wrap public pages
const PublicPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <PageLayout>{children}</PageLayout>
);

// Component to wrap dashboard pages
const DashboardPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <BulletproofDashboardLayout>{children}</BulletproofDashboardLayout>
);

// Component to wrap admin pages
const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <AdminLayoutEnhanced>{children}</AdminLayoutEnhanced>
);

const AppRouter = () => {
  return (
    <Routes>
      {/* ONBOARDING ROUTES (HIGHEST PRIORITY - full-screen without dashboard wrapper) */}
      <Route path="/onboarding" element={
        <PageErrorBoundary pageName="Onboarding">
          <EnhancedOnboardingPage />
        </PageErrorBoundary>
      } />
      <Route path="/enhanced-onboarding" element={
        <PageErrorBoundary pageName="Enhanced Onboarding">
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
      <Route path="/auth/email-pin" element={
        <PageErrorBoundary pageName="Email PIN Authentication">
          <EmailPinAuthPage />
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
      <Route path="/api-docs" element={
        <PageErrorBoundary pageName="API Documentation">
          <ApiDocs />
        </PageErrorBoundary>
      } />
      <Route path="/mobile-apps" element={
        <PageErrorBoundary pageName="Mobile Apps">
          <MobileApps />
        </PageErrorBoundary>
      } />
      <Route path="/reports" element={
        <PageErrorBoundary pageName="Reports">
          <Reports />
        </PageErrorBoundary>
      } />
      <Route path="/data-export" element={
        <PageErrorBoundary pageName="Data Export">
          <DataExport />
        </PageErrorBoundary>
      } />
      <Route path="/custom-integrations" element={
        <PageErrorBoundary pageName="Custom Integrations">
          <CustomIntegrations />
        </PageErrorBoundary>
      } />
      <Route path="/solutions/individuals" element={
        <PageErrorBoundary pageName="Solutions for Individuals">
          <Individuals />
        </PageErrorBoundary>
      } />
      <Route path="/solutions/families" element={
        <PageErrorBoundary pageName="Solutions for Families">
          <Families />
        </PageErrorBoundary>
      } />
      <Route path="/solutions/providers" element={
        <PageErrorBoundary pageName="Solutions for Providers">
          <Providers />
        </PageErrorBoundary>
      } />
      <Route path="/solutions/organizations" element={
        <PageErrorBoundary pageName="Solutions for Organizations">
          <Organizations />
        </PageErrorBoundary>
      } />
      <Route path="/family-features" element={
        <PageErrorBoundary pageName="Family Features">
          <FamilyFeaturesInfo />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-approaches/cbt" element={
        <PageErrorBoundary pageName="Cognitive Behavioral Therapy">
          <Suspense fallback={<div>Loading...</div>}>
            {React.createElement(React.lazy(() => import('../pages/therapy-approaches/CBT')))}
          </Suspense>
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-approaches/dbt" element={
        <PageErrorBoundary pageName="Dialectical Behavior Therapy">
          <Suspense fallback={<div>Loading...</div>}>
            {React.createElement(React.lazy(() => import('../pages/therapy-approaches/DBT')))}
          </Suspense>
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-approaches/mindfulness" element={
        <PageErrorBoundary pageName="Mindfulness-Based Therapy">
          <Suspense fallback={<div>Loading...</div>}>
            {React.createElement(React.lazy(() => import('../pages/therapy-approaches/Mindfulness')))}
          </Suspense>
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-approaches/trauma" element={
        <PageErrorBoundary pageName="Trauma-Focused Therapy">
          <Suspense fallback={<div>Loading...</div>}>
            {React.createElement(React.lazy(() => import('../pages/therapy-approaches/Trauma')))}
          </Suspense>
        </PageErrorBoundary>
      } />
      
      <Route path="/adaptive-systems" element={
        <PageErrorBoundary pageName="Adaptive AI Systems">
          <Suspense fallback={<div>Loading...</div>}>
            {React.createElement(React.lazy(() => import('../pages/AdaptiveSystems')))}
          </Suspense>
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
          <PricingPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/breathing-exercises" element={
        <PageErrorBoundary pageName="BreathingExercises">
          <BreathingExercisesPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/meditation-library" element={
        <PageErrorBoundary pageName="MeditationLibrary">
          <MeditationLibraryPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/community-features" element={
        <PageErrorBoundary pageName="Community Features">
          <CommunityFeatures />
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
      
      {/* Affiliate Program Routes */}
      <Route path="/affiliate-program" element={
        <PageErrorBoundary pageName="Affiliate Program">
          <PublicPageWrapper><AffiliateProgramPage /></PublicPageWrapper>
        </PageErrorBoundary>
      } />
      
      <Route path="/affiliate/*" element={
        <PageErrorBoundary pageName="Affiliate Dashboard">
          <DashboardPageWrapper><AffiliateRoutes /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />
      
      {/* USER DASHBOARD PAGES - Use BulletproofDashboardLayout (Sidebar) */}
      
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

      <Route path="/account-billing" element={
        <PageErrorBoundary pageName="Account & Billing">
          <AccountBilling />
        </PageErrorBoundary>
      } />

      <Route path="/sessions" element={
        <PageErrorBoundary pageName="Sessions">
          <DashboardPageWrapper><Sessions /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/notifications" element={
        <PageErrorBoundary pageName="Notifications">
          <NotificationsInbox />
        </PageErrorBoundary>
      } />

      <Route path="/therapy" element={
        <PageErrorBoundary pageName="Quick Chat">
          <QuickChatPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-chat" element={
        <PageErrorBoundary pageName="Quick Chat">
          <QuickChatPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-session" element={
        <PageErrorBoundary pageName="Full Therapy Session">
          <TherapySessionPage />
        </PageErrorBoundary>
      } />

      <Route path="/therapy-plan" element={
        <PageErrorBoundary pageName="Therapy Plan">
          <DashboardPageWrapper><TherapyPlanPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/progress-overview" element={
        <PageErrorBoundary pageName="Progress Overview">
          <DashboardPageWrapper><ProgressOverview /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Legacy routes - redirect to unified page */}
      <Route path="/billing" element={
        <PageErrorBoundary pageName="Billing">
          <BillingPage />
        </PageErrorBoundary>
      } />

      <Route path="/subscription" element={
        <PageErrorBoundary pageName="Subscription (Legacy)">
          <AccountBilling />
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

      {/* Quick Chat - Crisis/Immediate Support */}
      <Route path="/chat" element={
        <PageErrorBoundary pageName="Quick Chat">
          <QuickChatPage />
        </PageErrorBoundary>
      } />

      {/* NEW: Therapist Hub */}
      <Route path="/therapist-hub" element={
        <PageErrorBoundary pageName="Therapist Hub">
          <DashboardPageWrapper><TherapistHub /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* AI Personalization (Informational) */}
      <Route path="/ai-personalization" element={
        <PageErrorBoundary pageName="AI Personalization">
          <AIPersonalization />
        </PageErrorBoundary>
      } />

      {/* AI Hub (Dashboard) */}
      <Route path="/ai-hub" element={
        <PageErrorBoundary pageName="AI Hub">
          <DashboardPageWrapper><AIHub /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* NEW: Session Analytics */}
      <Route path="/session-analytics" element={
        <PageErrorBoundary pageName="Session Analytics">
          <SessionAnalytics />
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

      {/* Security & Compliance - Public informational page */}
      <Route path="/compliance" element={
        <PageErrorBoundary pageName="Security & Compliance">
          <PublicPageWrapper>
            <CompliancePage />
          </PublicPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Privacy Dashboard - User dashboard page */}
      <Route path="/privacy" element={
        <PageErrorBoundary pageName="Privacy Dashboard">
          <DashboardPageWrapper>
            <PrivacyDashboard />
          </DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Family Dashboard */}
      <Route path="/family-dashboard" element={
        <PageErrorBoundary pageName="Family Dashboard">
          <DashboardPageWrapper><FamilyDashboard /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Family Features Dashboard - Dashboard functionality */}
      <Route path="/family-features-dashboard" element={
        <PageErrorBoundary pageName="Family Features Dashboard">
          <DashboardPageWrapper><FamilyFeaturesPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* ADMIN ROUTES - Redirect to secure admin portal */}
      <Route path="/admin" element={<Navigate to="/secure-admin-portal-x9k2" replace />} />

      <Route path="/admin/ai" element={
        <PageErrorBoundary pageName="AI Personalization">
          <DashboardPageWrapper><AIPersonalization /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/admin/analytics" element={
        <PageErrorBoundary pageName="Analytics">
          <DashboardPageWrapper><AnalyticsPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/admin/content" element={
        <PageErrorBoundary pageName="Content Library">
          <DashboardPageWrapper><ContentLibrary /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/admin/translations" element={
        <PageErrorBoundary pageName="Personalization Settings">
          <DashboardPageWrapper><PersonalizationSettingsPage /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      <Route path="/admin/therapy" element={
        <PageErrorBoundary pageName="Therapist Hub">
          <DashboardPageWrapper><TherapistHub /></DashboardPageWrapper>
        </PageErrorBoundary>
      } />

      {/* Content Library */}
      <Route path="/content-library" element={
        <PageErrorBoundary pageName="Content Library">
          <DashboardPageWrapper><ContentLibrary /></DashboardPageWrapper>
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
