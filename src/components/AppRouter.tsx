
import React from "react";
import { Routes, Route } from "react-router-dom";
import MinimalErrorBoundary from "@/components/MinimalErrorBoundary";
import BulletproofPageWrapper from "@/components/BulletproofPageWrapper";

// PHASE 4: Replace lazy loading with direct imports to eliminate blank page issues
import Index from "../pages/Index";
import MinimalIndex from "../pages/MinimalIndex";
import Dashboard from "../pages/Dashboard";
import EnhancedAuth from "../pages/EnhancedAuth";
import EnhancedOnboardingPage from "../pages/EnhancedOnboardingPage";
import Pricing from "../pages/Pricing";
import FeaturesOverview from "../pages/FeaturesOverview";
import HowItWorks from "../pages/HowItWorks";
import FeaturesShowcase from "../pages/FeaturesShowcase";
import TherapyTypes from "../pages/TherapyTypes";
import CommunityFeatures from "../pages/CommunityFeatures";
import FamilyFeaturesPage from "../pages/FamilyFeaturesPage";
import CulturalAIFeatures from "../pages/CulturalAIFeatures";
import VoiceTechnology from "../pages/VoiceTechnology";
import CrisisSupport from "../pages/CrisisSupport";
import CrisisResources from "../pages/CrisisResources";
import MoodTracking from "../pages/MoodTracking";
import Integrations from "../pages/Integrations";
import Community from "../pages/Community";
import Support from "../pages/Support";
import Help from "../pages/Help";
import TherapyChatPage from "../pages/TherapyChatPage";
import QuantumTherapy from "../pages/QuantumTherapy";
import BlockchainHealth from "../pages/BlockchainHealth";
import NeuralInterface from "../pages/NeuralInterface";
import TestPage from "../pages/TestPage";
import ComponentHealthCheck from "../pages/ComponentHealthCheck";
import UserControlledRecoveryDashboard from "../components/UserControlledRecoveryDashboard";
import RecoveryMonitoringDashboard from "../components/analytics/RecoveryMonitoringDashboard";

// Safe fallback for any component failures
const SafeFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
      <h2 className="text-2xl font-bold text-therapy-600 mb-4">TherapySync</h2>
      <p className="text-slate-600 mb-4">This page couldn't load properly.</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-therapy-600 text-white px-6 py-3 rounded-lg hover:bg-therapy-700 transition-colors font-semibold"
      >
        Go Home
      </button>
    </div>
  </div>
);

// Simplified route wrapper - single error boundary per route
const SimpleRouteWrapper: React.FC<{ children: React.ReactNode; name: string }> = ({ children, name }) => {
  return (
    <MinimalErrorBoundary>
      <React.Suspense fallback={<SafeFallback />}>
        {children}
      </React.Suspense>
    </MinimalErrorBoundary>
  );
};

const AppRouter = () => {
  console.log('AppRouter: Initializing stable router with direct imports');
  
  return (
    <MinimalErrorBoundary>
      <Routes>
        <Route path="/" element={
          <SimpleRouteWrapper name="Index">
            <Index />
          </SimpleRouteWrapper>
        } />
        <Route path="/minimal" element={
          <SimpleRouteWrapper name="MinimalIndex">
            <MinimalIndex />
          </SimpleRouteWrapper>
        } />
        <Route path="/auth" element={
          <SimpleRouteWrapper name="Auth">
            <EnhancedAuth />
          </SimpleRouteWrapper>
        } />
        <Route path="/onboarding" element={
          <SimpleRouteWrapper name="Onboarding">
            <EnhancedOnboardingPage />
          </SimpleRouteWrapper>
        } />
        <Route path="/dashboard" element={
          <SimpleRouteWrapper name="Dashboard">
            <Dashboard />
          </SimpleRouteWrapper>
        } />
        <Route path="/quantum-therapy" element={
          <SimpleRouteWrapper name="QuantumTherapy">
            <QuantumTherapy />
          </SimpleRouteWrapper>
        } />
        <Route path="/blockchain-health" element={
          <SimpleRouteWrapper name="BlockchainHealth">
            <BlockchainHealth />
          </SimpleRouteWrapper>
        } />
        <Route path="/neural-interface" element={
          <SimpleRouteWrapper name="NeuralInterface">
            <NeuralInterface />
          </SimpleRouteWrapper>
        } />
        <Route path="/test" element={
          <SimpleRouteWrapper name="Test">
            <TestPage />
          </SimpleRouteWrapper>
        } />
        <Route path="/component-health" element={
          <SimpleRouteWrapper name="ComponentHealth">
            <ComponentHealthCheck />
          </SimpleRouteWrapper>
        } />
        <Route path="/recovery-dashboard" element={
          <SimpleRouteWrapper name="RecoveryDashboard">
            <UserControlledRecoveryDashboard />
          </SimpleRouteWrapper>
        } />
        <Route path="/recovery-monitoring" element={
          <SimpleRouteWrapper name="RecoveryMonitoring">
            <RecoveryMonitoringDashboard />
          </SimpleRouteWrapper>
        } />
        <Route path="/pricing" element={
          <SimpleRouteWrapper name="Pricing">
            <Pricing />
          </SimpleRouteWrapper>
        } />
        <Route path="/features-overview" element={
          <SimpleRouteWrapper name="FeaturesOverview">
            <FeaturesOverview />
          </SimpleRouteWrapper>
        } />
        <Route path="/how-it-works" element={
          <SimpleRouteWrapper name="HowItWorks">
            <HowItWorks />
          </SimpleRouteWrapper>
        } />
        <Route path="/features-showcase" element={
          <SimpleRouteWrapper name="FeaturesShowcase">
            <FeaturesShowcase />
          </SimpleRouteWrapper>
        } />
        <Route path="/therapy-types" element={
          <SimpleRouteWrapper name="TherapyTypes">
            <TherapyTypes />
          </SimpleRouteWrapper>
        } />
        <Route path="/community-features" element={
          <SimpleRouteWrapper name="CommunityFeatures">
            <CommunityFeatures />
          </SimpleRouteWrapper>
        } />
        <Route path="/family-features" element={
          <SimpleRouteWrapper name="FamilyFeatures">
            <FamilyFeaturesPage />
          </SimpleRouteWrapper>
        } />
        <Route path="/cultural-ai-features" element={
          <SimpleRouteWrapper name="CulturalAIFeatures">
            <CulturalAIFeatures />
          </SimpleRouteWrapper>
        } />
        <Route path="/voice-technology" element={
          <SimpleRouteWrapper name="VoiceTechnology">
            <VoiceTechnology />
          </SimpleRouteWrapper>
        } />
        <Route path="/crisis-support" element={
          <SimpleRouteWrapper name="CrisisSupport">
            <CrisisSupport />
          </SimpleRouteWrapper>
        } />
        <Route path="/crisis-resources" element={
          <SimpleRouteWrapper name="CrisisResources">
            <CrisisResources />
          </SimpleRouteWrapper>
        } />
        <Route path="/mood-tracking" element={
          <SimpleRouteWrapper name="MoodTracking">
            <MoodTracking />
          </SimpleRouteWrapper>
        } />
        <Route path="/integrations" element={
          <SimpleRouteWrapper name="Integrations">
            <Integrations />
          </SimpleRouteWrapper>
        } />
        <Route path="/community" element={
          <SimpleRouteWrapper name="Community">
            <Community />
          </SimpleRouteWrapper>
        } />
        <Route path="/support" element={
          <SimpleRouteWrapper name="Support">
            <Support />
          </SimpleRouteWrapper>
        } />
        <Route path="/help" element={
          <SimpleRouteWrapper name="Help">
            <Help />
          </SimpleRouteWrapper>
        } />
        <Route path="/therapy-chat" element={
          <SimpleRouteWrapper name="TherapyChat">
            <TherapyChatPage />
          </SimpleRouteWrapper>
        } />
        <Route path="/compare-plans" element={
          <SimpleRouteWrapper name="ComparePlans">
            <Index />
          </SimpleRouteWrapper>
        } />
      </Routes>
    </MinimalErrorBoundary>
  );
};

export default AppRouter;
