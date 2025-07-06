
import { Routes, Route } from "react-router-dom";
import { PageErrorBoundary } from "@/components/bulletproof/PageErrorBoundary";

// Core Pages
import Index from "../pages/Index";
import GetStarted from "../pages/GetStarted";
import EnhancedAuth from "../pages/EnhancedAuth";
import Auth from "../pages/Auth";
import EnhancedOnboardingPage from "../pages/EnhancedOnboardingPage";
import OnboardingPage from "../pages/OnboardingPage";
import Onboarding from "../pages/Onboarding";
import Dashboard from "../pages/Dashboard";

// Feature Pages
import GoalsPage from "../pages/GoalsPage";
import Goals from "../pages/Goals";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import VoiceSettings from "../pages/VoiceSettings";
import EnhancedAIPersonalization from "../pages/EnhancedAIPersonalization";
import AdvancedAnalytics from "../pages/AdvancedAnalytics";
import EnhancedTherapy from "../pages/EnhancedTherapy";
import DashboardOptimization from "../pages/DashboardOptimization";
import TherapySyncAI from "../pages/TherapySyncAI";
import TherapyPlan from "../pages/TherapyPlan";
import TherapistSelection from "../pages/TherapistSelection";

// Additional Dashboard Pages
import DashboardGoals from "../pages/DashboardGoals";
import CommunityHub from "../pages/CommunityHub";
import ProgressOverview from "../pages/ProgressOverview";
import TherapyChatPage from "../pages/TherapyChatPage";
import Sessions from "../pages/Sessions";
import MoodTracker from "../pages/MoodTracker";
import Analytics from "../pages/Analytics";
import Community from "../pages/Community";
import SubscriptionPage from "../pages/SubscriptionPage";
import Help from "../pages/Help";
import Support from "../pages/Support";
import TherapySettingsPage from "../pages/TherapySettingsPage";
import FamilyFeaturesPage from "../pages/FamilyFeaturesPage";
import NotificationCenterPage from "../pages/NotificationCenter";
import NotificationSettingsPage from "../pages/NotificationSettings";
import Integrations from "../pages/Integrations";
import SmartTriggerDashboard from "../components/admin/SmartTriggerDashboard";
import NotificationAnalyticsDashboard from "../components/admin/analytics/NotificationAnalyticsDashboard";
import CampaignDashboard from "../components/admin/campaigns/CampaignDashboard";
import WorkflowBuilder from "../components/admin/workflows/WorkflowBuilder";
import EnhancedCrisisManager from "../components/crisis/EnhancedCrisisManager";
import RealTimeChat from "../components/collaboration/RealTimeChat";

// AI Personalization Pages
import AIInsights from "../pages/ai-personalization/AIInsights";
import AIPatterns from "../pages/ai-personalization/AIPatterns";
import AIRecommendations from "../pages/ai-personalization/AIRecommendations";
import AIPredictions from "../pages/ai-personalization/AIPredictions";

// Sessions Pages
import AllSessions from "../pages/sessions/AllSessions";

// Goals Pages
import ActiveGoals from "../pages/goals/ActiveGoals";

// Error Pages
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      {/* Core Routes */}
      <Route path="/" element={
        <PageErrorBoundary pageName="Home">
          <Index />
        </PageErrorBoundary>
      } />
      
      <Route path="/get-started" element={
        <PageErrorBoundary pageName="Get Started">
          <GetStarted />
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
      
      {/* Onboarding Routes */}
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
      
      {/* Feature Routes */}
      <Route path="/goals" element={
        <PageErrorBoundary pageName="Goals">
          <DashboardGoals />
        </PageErrorBoundary>
      } />
      <Route path="/goals-marketing" element={
        <PageErrorBoundary pageName="Goals (Marketing)">
          <Goals />
        </PageErrorBoundary>
      } />
      
      <Route path="/progress-overview" element={
        <PageErrorBoundary pageName="Progress Overview">
          <ProgressOverview />
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
      
      {/* AI Personalization Nested Routes */}
      <Route path="/ai-personalization/dashboard/insights" element={
        <PageErrorBoundary pageName="AI Insights">
          <AIInsights />
        </PageErrorBoundary>
      } />
      <Route path="/ai-personalization/dashboard/patterns" element={
        <PageErrorBoundary pageName="AI Patterns">
          <AIPatterns />
        </PageErrorBoundary>
      } />
      <Route path="/ai-personalization/dashboard/recommendations" element={
        <PageErrorBoundary pageName="AI Recommendations">
          <AIRecommendations />
        </PageErrorBoundary>
      } />
      <Route path="/ai-personalization/dashboard/predictions" element={
        <PageErrorBoundary pageName="AI Predictions">
          <AIPredictions />
        </PageErrorBoundary>
      } />
      <Route path="/ai-personalization/recommendations" element={
        <PageErrorBoundary pageName="Smart Recommendations">
          <div>Smart Recommendations Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/ai-personalization/contextual" element={
        <PageErrorBoundary pageName="Contextual AI">
          <div>Contextual AI Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/ai-personalization/settings" element={
        <PageErrorBoundary pageName="AI Settings">
          <div>AI Settings Page - Placeholder</div>
        </PageErrorBoundary>
      } />

      {/* Sessions Nested Routes */}
      <Route path="/sessions/all" element={
        <PageErrorBoundary pageName="All Sessions">
          <AllSessions />
        </PageErrorBoundary>
      } />
      <Route path="/goals/active" element={
        <PageErrorBoundary pageName="Active Goals">
          <ActiveGoals />
        </PageErrorBoundary>
      } />
      <Route path="/goals/templates" element={
        <PageErrorBoundary pageName="Goal Templates">
          <div>Goal Templates Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress/weekly" element={
        <PageErrorBoundary pageName="Weekly Goal Progress">
          <div>Weekly Goal Progress Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress/monthly" element={
        <PageErrorBoundary pageName="Monthly Goal Analysis">
          <div>Monthly Goal Analysis Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress/milestones" element={
        <PageErrorBoundary pageName="Milestone Tracker">
          <div>Milestone Tracker Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress/habits" element={
        <PageErrorBoundary pageName="Habit Formation">
          <div>Habit Formation Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/goals/achievements" element={
        <PageErrorBoundary pageName="Achievements">
          <div>Achievements Page - Placeholder</div>
        </PageErrorBoundary>
      } />

      {/* Mood Tracker Nested Routes */}
      <Route path="/mood-tracker/daily" element={
        <PageErrorBoundary pageName="Daily Mood Tracker">
          <div>Daily Mood Tracker Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/patterns/weekly" element={
        <PageErrorBoundary pageName="Weekly Mood Patterns">
          <div>Weekly Mood Patterns Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/patterns/triggers" element={
        <PageErrorBoundary pageName="Mood Trigger Analysis">
          <div>Mood Trigger Analysis Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/patterns/correlations" element={
        <PageErrorBoundary pageName="Mood Correlation Insights">
          <div>Mood Correlation Insights Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/patterns/journey" element={
        <PageErrorBoundary pageName="Emotional Journey">
          <div>Emotional Journey Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/insights" element={
        <PageErrorBoundary pageName="Mood Insights">
          <div>Mood Insights Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/history" element={
        <PageErrorBoundary pageName="Mood History">
          <div>Mood History Page - Placeholder</div>
        </PageErrorBoundary>
      } />

      {/* Advanced Analytics Nested Routes */}
      <Route path="/advanced-analytics/performance/health" element={
        <PageErrorBoundary pageName="System Health">
          <div>System Health Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/advanced-analytics/performance/metrics" element={
        <PageErrorBoundary pageName="Real-time Metrics">
          <div>Real-time Metrics Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/advanced-analytics/performance/alerts" element={
        <PageErrorBoundary pageName="Alerts & Monitoring">
          <div>Alerts & Monitoring Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/advanced-analytics/performance/history" element={
        <PageErrorBoundary pageName="Performance History">
          <div>Performance History Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/advanced-analytics/behavior" element={
        <PageErrorBoundary pageName="User Behavior Analytics">
          <div>User Behavior Analytics Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/advanced-analytics/business" element={
        <PageErrorBoundary pageName="Business Intelligence">
          <div>Business Intelligence Page - Placeholder</div>
        </PageErrorBoundary>
      } />

      {/* Integrations Nested Routes */}
      <Route path="/integrations/platforms/messaging" element={
        <PageErrorBoundary pageName="Messaging Platforms">
          <div>Messaging Platforms Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/integrations/platforms/productivity" element={
        <PageErrorBoundary pageName="Productivity Tools">
          <div>Productivity Tools Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/integrations/platforms/health" element={
        <PageErrorBoundary pageName="Health Integrations">
          <div>Health Integrations Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/integrations/platforms/analytics" element={
        <PageErrorBoundary pageName="Analytics & Reporting">
          <div>Analytics & Reporting Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/integrations/notifications" element={
        <PageErrorBoundary pageName="Integration Notification Settings">
          <div>Integration Notification Settings Page - Placeholder</div>
        </PageErrorBoundary>
      } />
      <Route path="/integrations/analytics" element={
        <PageErrorBoundary pageName="Integration Usage Analytics">
          <div>Integration Usage Analytics Page - Placeholder</div>
        </PageErrorBoundary>
      } />

      {/* Advanced Feature Routes */}
      <Route path="/ai-personalization" element={
        <PageErrorBoundary pageName="AI Personalization">
          <EnhancedAIPersonalization />
        </PageErrorBoundary>
      } />
      
      <Route path="/advanced-analytics" element={
        <PageErrorBoundary pageName="Advanced Analytics">
          <AdvancedAnalytics />
        </PageErrorBoundary>
      } />
      
      <Route path="/enhanced-therapy" element={
        <PageErrorBoundary pageName="Enhanced Therapy">
          <EnhancedTherapy />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-ai" element={
        <PageErrorBoundary pageName="TherapySync AI">
          <TherapySyncAI />
        </PageErrorBoundary>
      } />
      
      <Route path="/dashboard-optimization" element={
        <PageErrorBoundary pageName="Dashboard Optimization">
          <DashboardOptimization />
        </PageErrorBoundary>
      } />
      
      {/* New Therapy System Routes */}
      <Route path="/therapy-plan" element={
        <PageErrorBoundary pageName="Therapy Plan">
          <TherapyPlan />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapist-selection" element={
        <PageErrorBoundary pageName="Therapist Selection">
          <TherapistSelection />
        </PageErrorBoundary>
      } />
      
      <Route path="/chat" element={
        <PageErrorBoundary pageName="Enhanced Therapy Chat">
          <EnhancedTherapy />
        </PageErrorBoundary>
      } />
      
      <Route path="/voice-settings" element={
        <PageErrorBoundary pageName="Voice Settings">
          <VoiceSettings />
        </PageErrorBoundary>
      } />
      
      <Route path="/multi-language" element={
        <PageErrorBoundary pageName="Multi-Language">
          <VoiceSettings />
        </PageErrorBoundary>
      } />
      
      {/* Dashboard Navigation Routes */}
      
      <Route path="/therapy-chat" element={
        <PageErrorBoundary pageName="Therapy Chat">
          <TherapyChatPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/sessions" element={
        <PageErrorBoundary pageName="Sessions">
          <Sessions />
        </PageErrorBoundary>
      } />
      
      <Route path="/mood-tracker" element={
        <PageErrorBoundary pageName="Mood Tracker">
          <MoodTracker />
        </PageErrorBoundary>
      } />
      
      <Route path="/analytics" element={
        <PageErrorBoundary pageName="Analytics">
          <Analytics />
        </PageErrorBoundary>
      } />
      
      <Route path="/community" element={
        <PageErrorBoundary pageName="Community">
          <CommunityHub />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-settings" element={
        <PageErrorBoundary pageName="Therapy Settings">
          <TherapySettingsPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/billing" element={
        <PageErrorBoundary pageName="Billing">
          <SubscriptionPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/family-features" element={
        <PageErrorBoundary pageName="Family Features">
          <FamilyFeaturesPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/notification-center" element={
        <PageErrorBoundary pageName="Notification Center">
          <NotificationCenterPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/notification-settings" element={
        <PageErrorBoundary pageName="Notification Settings">
          <NotificationSettingsPage />
        </PageErrorBoundary>
      } />
      
      <Route path="/integrations" element={
        <PageErrorBoundary pageName="Integrations">
          <Integrations />
        </PageErrorBoundary>
      } />
      
      <Route path="/smart-triggers" element={
        <PageErrorBoundary pageName="Smart Triggers">
          <SmartTriggerDashboard />
        </PageErrorBoundary>
      } />
      
      <Route path="/notification-analytics" element={
        <PageErrorBoundary pageName="Notification Analytics">
          <NotificationAnalyticsDashboard />
        </PageErrorBoundary>
      } />
      
      <Route path="/campaign-management" element={
        <PageErrorBoundary pageName="Campaign Management">
          <CampaignDashboard />
        </PageErrorBoundary>
      } />
      
      <Route path="/workflow-builder" element={
        <PageErrorBoundary pageName="Workflow Builder">
          <WorkflowBuilder />
        </PageErrorBoundary>
      } />
      
      <Route path="/help" element={
        <PageErrorBoundary pageName="Help">
          <Help />
        </PageErrorBoundary>
      } />
      
      <Route path="/support" element={
        <PageErrorBoundary pageName="Support">
          <Support />
        </PageErrorBoundary>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
