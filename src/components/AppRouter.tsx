
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
import EnhancedAIPersonalization from "../pages/EnhancedAIPersonalization";
import AdvancedAnalytics from "../pages/AdvancedAnalytics";
import EnhancedTherapy from "../pages/EnhancedTherapy";
import DashboardOptimization from "../pages/DashboardOptimization";
import TherapySyncAI from "../pages/TherapySyncAI";

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
          <Goals />
        </PageErrorBoundary>
      } />
      <Route path="/goals-legacy" element={
        <PageErrorBoundary pageName="Goals (Legacy)">
          <GoalsPage />
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
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
