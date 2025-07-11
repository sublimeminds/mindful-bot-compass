
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

// Integration Platform Pages
import MessagingPlatforms from "../pages/integrations/MessagingPlatforms";
import ProductivityTools from "../pages/integrations/ProductivityTools";
import HealthIntegrations from "../pages/integrations/HealthIntegrations";
import AnalyticsReporting from "../pages/integrations/AnalyticsReporting";
import IntegrationNotifications from "../pages/integrations/IntegrationNotifications";
import IntegrationAnalytics from "../pages/integrations/IntegrationAnalytics";
import SmartTriggerDashboard from "../components/admin/SmartTriggerDashboard";
import NotificationAnalyticsDashboard from "../components/admin/analytics/NotificationAnalyticsDashboard";
import CampaignDashboard from "../components/admin/campaigns/CampaignDashboard";
import WorkflowBuilder from "../components/admin/workflows/WorkflowBuilder";
import EnhancedCrisisManager from "../components/crisis/EnhancedCrisisManager";
import RealTimeChat from "../components/collaboration/RealTimeChat";
import AIIntegrationHub from "../components/ai/AIIntegrationHub";

// AI Personalization Pages
import AIInsights from "../pages/ai-personalization/AIInsights";
import AIPatterns from "../pages/ai-personalization/AIPatterns";
import AIRecommendations from "../pages/ai-personalization/AIRecommendations";
import AIPredictions from "../pages/ai-personalization/AIPredictions";
import SmartRecommendationEngine from "../pages/ai-personalization/SmartRecommendationEngine";
import ContextualAIAssistant from "../pages/ai-personalization/ContextualAIAssistant";
import AISettingsConfiguration from "../pages/ai-personalization/AISettingsConfiguration";

// Sessions Pages
import AllSessions from "../pages/sessions/AllSessions";
import LiveSessions from "../pages/sessions/LiveSessions";
import SessionAnalytics from "../pages/sessions/SessionAnalytics";
import SessionPlanner from "../pages/sessions/SessionPlanner";
import PerformanceMetrics from "../pages/sessions/PerformanceMetrics";
import MoodAnalysis from "../pages/sessions/MoodAnalysis";
import TechniqueEffectiveness from "../pages/sessions/TechniqueEffectiveness";
import TimeAnalysis from "../pages/sessions/TimeAnalysis";

// Goals Pages
import ActiveGoals from "../pages/goals/ActiveGoals";
import GoalTemplates from "../pages/goals/GoalTemplates";
import GoalAchievements from "../pages/goals/GoalAchievements";
import GoalProgress from "../pages/goals/GoalProgress";
import WeeklyView from "../pages/goals/WeeklyView";
import MonthlyAnalysis from "../pages/goals/MonthlyAnalysis";
import MilestoneTracker from "../pages/goals/MilestoneTracker";
import HabitFormation from "../pages/goals/HabitFormation";

// Mood Tracker Pages
import DailyMoodTracker from "../pages/mood-tracker/DailyMoodTracker";
import MoodInsights from "../pages/mood-tracker/MoodInsights";
import MoodPatterns from "../pages/mood-tracker/patterns/MoodPatterns";
import EmotionAnalysis from "../pages/mood-tracker/patterns/EmotionAnalysis";

// Advanced Analytics System Monitoring Pages
import SystemHealth from "../pages/advanced-analytics/SystemHealth";
import RealTimeMetrics from "../pages/advanced-analytics/RealTimeMetrics";
import AlertsMonitoring from "../pages/advanced-analytics/AlertsMonitoring";

// Marketing/Feature Pages
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
import TherapistAssessmentPage from "../pages/TherapistAssessmentPage";
import TherapistSelectionPage from "../pages/TherapistSelectionPage";
import TherapistDashboard from "../components/therapist/TherapistDashboard";
import FavoritesPage from "../pages/FavoritesPage";
import GamificationDashboard from "../pages/GamificationDashboard";
import CompliancePage from "../pages/CompliancePage";

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
          <SmartRecommendationEngine />
        </PageErrorBoundary>
      } />
      <Route path="/ai-personalization/contextual" element={
        <PageErrorBoundary pageName="Contextual AI">
          <ContextualAIAssistant />
        </PageErrorBoundary>
      } />
      <Route path="/ai-personalization/settings" element={
        <PageErrorBoundary pageName="AI Settings">
          <AISettingsConfiguration />
        </PageErrorBoundary>
      } />

      {/* Sessions Nested Routes */}
      <Route path="/sessions/all" element={
        <PageErrorBoundary pageName="All Sessions">
          <AllSessions />
        </PageErrorBoundary>
      } />
      <Route path="/sessions/live" element={
        <PageErrorBoundary pageName="Live Sessions">
          <LiveSessions />
        </PageErrorBoundary>
      } />
      <Route path="/sessions/analytics" element={
        <PageErrorBoundary pageName="Session Analytics">
          <SessionAnalytics />
        </PageErrorBoundary>
      } />
      <Route path="/sessions/planner" element={
        <PageErrorBoundary pageName="Session Planner">
          <SessionPlanner />
        </PageErrorBoundary>
      } />
      <Route path="/sessions/performance" element={
        <PageErrorBoundary pageName="Performance Metrics">
          <PerformanceMetrics />
        </PageErrorBoundary>
      } />
      <Route path="/sessions/mood-analysis" element={
        <PageErrorBoundary pageName="Mood Analysis">
          <MoodAnalysis />
        </PageErrorBoundary>
      } />
      <Route path="/sessions/technique-effectiveness" element={
        <PageErrorBoundary pageName="Technique Effectiveness">
          <TechniqueEffectiveness />
        </PageErrorBoundary>
      } />
      <Route path="/sessions/time-analysis" element={
        <PageErrorBoundary pageName="Time Analysis">
          <TimeAnalysis />
        </PageErrorBoundary>
      } />

      {/* Goals Nested Routes */}
      <Route path="/goals/active" element={
        <PageErrorBoundary pageName="Active Goals">
          <ActiveGoals />
        </PageErrorBoundary>
      } />
      <Route path="/goals/templates" element={
        <PageErrorBoundary pageName="Goal Templates">
          <GoalTemplates />
        </PageErrorBoundary>
      } />
      <Route path="/goals/achievements" element={
        <PageErrorBoundary pageName="Goal Achievements">
          <GoalAchievements />
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress" element={
        <PageErrorBoundary pageName="Goal Progress">
          <GoalProgress />
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress/weekly" element={
        <PageErrorBoundary pageName="Weekly View">
          <WeeklyView />
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress/monthly" element={
        <PageErrorBoundary pageName="Monthly Analysis">
          <MonthlyAnalysis />
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress/milestones" element={
        <PageErrorBoundary pageName="Milestone Tracker">
          <MilestoneTracker />
        </PageErrorBoundary>
      } />
      <Route path="/goals/progress/habits" element={
        <PageErrorBoundary pageName="Habit Formation">
          <HabitFormation />
        </PageErrorBoundary>
      } />

      {/* Enhanced Mood Analytics Routes */}
      <Route path="/mood-tracker/daily" element={
        <PageErrorBoundary pageName="Daily Mood Tracker">
          <DailyMoodTracker />
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/insights" element={
        <PageErrorBoundary pageName="Mood Insights">
          <MoodInsights />
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/patterns" element={
        <PageErrorBoundary pageName="Mood Patterns">
          <MoodPatterns />
        </PageErrorBoundary>
      } />
      <Route path="/mood-tracker/emotion-analysis" element={
        <PageErrorBoundary pageName="Emotion Analysis">
          <EmotionAnalysis />
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
      <Route path="/mood-tracker/history" element={
        <PageErrorBoundary pageName="Mood History">
          <div>Mood History Page - Placeholder</div>
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
          <CulturalAIFeatures />
        </PageErrorBoundary>
      } />
      
      <Route path="/features-overview" element={
        <PageErrorBoundary pageName="Features Overview">
          <FeaturesOverview />
        </PageErrorBoundary>
      } />
      
      <Route path="/how-it-works" element={
        <PageErrorBoundary pageName="How It Works">
          <HowItWorks />
        </PageErrorBoundary>
      } />
      
      <Route path="/features-showcase" element={
        <PageErrorBoundary pageName="Features Showcase">
          <FeaturesShowcase />
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
          <CommunityFeatures />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-types" element={
        <PageErrorBoundary pageName="Therapy Types">
          <TherapyTypes />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapy-sync-ai" element={
        <PageErrorBoundary pageName="TherapySync AI">
          <TherapySyncAI />
        </PageErrorBoundary>
      } />
      
      <Route path="/ai-architecture" element={
        <PageErrorBoundary pageName="AI Architecture">
          <AIArchitecture />
        </PageErrorBoundary>
      } />
      
      <Route path="/therapist-discovery" element={
        <PageErrorBoundary pageName="Therapist Discovery">
          <TherapistDiscovery />
        </PageErrorBoundary>
      } />

      <Route path="/therapist-assessment" element={
        <PageErrorBoundary pageName="Therapist Assessment">
          <TherapistAssessmentPage />
        </PageErrorBoundary>
      } />

      <Route path="/therapist-selection" element={
        <PageErrorBoundary pageName="Therapist Selection">
          <TherapistSelectionPage />
        </PageErrorBoundary>
      } />

      <Route path="/therapist-dashboard" element={
        <PageErrorBoundary pageName="Therapist Dashboard">
          <TherapistDashboard />
        </PageErrorBoundary>
      } />

      <Route path="/favorites" element={
        <PageErrorBoundary pageName="Favorites">
          <FavoritesPage />
        </PageErrorBoundary>
      } />

      {/* Health Check Endpoint for Monitoring */}
      <Route path="/health" element={<div>healthy</div>} />

      {/* Advanced Analytics System Monitoring Routes */}
      <Route path="/advanced-analytics/system-health" element={
        <PageErrorBoundary pageName="System Health">
          <SystemHealth />
        </PageErrorBoundary>
      } />
      <Route path="/advanced-analytics/real-time-metrics" element={
        <PageErrorBoundary pageName="Real-Time Metrics">
          <RealTimeMetrics />
        </PageErrorBoundary>
      } />
      <Route path="/advanced-analytics/alerts-monitoring" element={
        <PageErrorBoundary pageName="Alerts & Monitoring">
          <AlertsMonitoring />
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
          <MessagingPlatforms />
        </PageErrorBoundary>
      } />
      <Route path="/integrations/platforms/productivity" element={
        <PageErrorBoundary pageName="Productivity Tools">
          <ProductivityTools />
        </PageErrorBoundary>
      } />
      <Route path="/integrations/platforms/health" element={
        <PageErrorBoundary pageName="Health Integrations">
          <HealthIntegrations />
        </PageErrorBoundary>
      } />
      <Route path="/integrations/platforms/analytics" element={
        <PageErrorBoundary pageName="Analytics & Reporting">
          <AnalyticsReporting />
        </PageErrorBoundary>
      } />
      <Route path="/integrations/notifications" element={
        <PageErrorBoundary pageName="Integration Notification Settings">
          <IntegrationNotifications />
        </PageErrorBoundary>
      } />
      <Route path="/integrations/analytics" element={
        <PageErrorBoundary pageName="Integration Usage Analytics">
          <IntegrationAnalytics />
        </PageErrorBoundary>
      } />

      {/* Advanced Feature Routes */}
      <Route path="/ai-personalization" element={
        <PageErrorBoundary pageName="AI Personalization">
          <EnhancedAIPersonalization />
        </PageErrorBoundary>
      } />
      
      <Route path="/ai-dashboard" element={
        <PageErrorBoundary pageName="AI Dashboard">
          <AIIntegrationHub />
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
      
      <Route path="/gamification-dashboard" element={
        <PageErrorBoundary pageName="Gamification Dashboard">
          <GamificationDashboard />
        </PageErrorBoundary>
      } />
      
      <Route path="/compliance" element={
        <PageErrorBoundary pageName="Compliance">
          <CompliancePage />
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
