
import React from "react";
import { Routes, Route } from "react-router-dom";
import MinimalErrorBoundary from "@/components/MinimalErrorBoundary";

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

// PHASE 2: Component isolation with error boundaries for each route
const IsolatedRouteWrapper: React.FC<{ children: React.ReactNode; name: string }> = ({ children, name }) => {
  console.log(`IsolatedRouteWrapper: Rendering ${name} page`);
  
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
          <IsolatedRouteWrapper name="Index">
            <Index />
          </IsolatedRouteWrapper>
        } />
        <Route path="/minimal" element={
          <IsolatedRouteWrapper name="MinimalIndex">
            <MinimalIndex />
          </IsolatedRouteWrapper>
        } />
        <Route path="/auth" element={
          <IsolatedRouteWrapper name="Auth">
            <EnhancedAuth />
          </IsolatedRouteWrapper>
        } />
        <Route path="/onboarding" element={
          <IsolatedRouteWrapper name="Onboarding">
            <EnhancedOnboardingPage />
          </IsolatedRouteWrapper>
        } />
        <Route path="/dashboard" element={
          <IsolatedRouteWrapper name="Dashboard">
            <Dashboard />
          </IsolatedRouteWrapper>
        } />
        <Route path="/quantum-therapy" element={
          <IsolatedRouteWrapper name="QuantumTherapy">
            <QuantumTherapy />
          </IsolatedRouteWrapper>
        } />
        <Route path="/blockchain-health" element={
          <IsolatedRouteWrapper name="BlockchainHealth">
            <BlockchainHealth />
          </IsolatedRouteWrapper>
        } />
        <Route path="/neural-interface" element={
          <IsolatedRouteWrapper name="NeuralInterface">
            <NeuralInterface />
          </IsolatedRouteWrapper>
        } />
        <Route path="/test" element={
          <IsolatedRouteWrapper name="Test">
            <TestPage />
          </IsolatedRouteWrapper>
        } />
        <Route path="/component-health" element={
          <IsolatedRouteWrapper name="ComponentHealth">
            <ComponentHealthCheck />
          </IsolatedRouteWrapper>
        } />
        <Route path="/recovery-dashboard" element={
          <IsolatedRouteWrapper name="RecoveryDashboard">
            <UserControlledRecoveryDashboard />
          </IsolatedRouteWrapper>
        } />
        <Route path="/recovery-monitoring" element={
          <IsolatedRouteWrapper name="RecoveryMonitoring">
            <RecoveryMonitoringDashboard />
          </IsolatedRouteWrapper>
        } />
        <Route path="/pricing" element={
          <IsolatedRouteWrapper name="Pricing">
            <Pricing />
          </IsolatedRouteWrapper>
        } />
        <Route path="/features-overview" element={
          <IsolatedRouteWrapper name="FeaturesOverview">
            <FeaturesOverview />
          </IsolatedRouteWrapper>
        } />
        <Route path="/how-it-works" element={
          <IsolatedRouteWrapper name="HowItWorks">
            <HowItWorks />
          </IsolatedRouteWrapper>
        } />
        <Route path="/features-showcase" element={
          <IsolatedRouteWrapper name="FeaturesShowcase">
            <FeaturesShowcase />
          </IsolatedRouteWrapper>
        } />
        <Route path="/therapy-types" element={
          <IsolatedRouteWrapper name="TherapyTypes">
            <TherapyTypes />
          </IsolatedRouteWrapper>
        } />
        <Route path="/community-features" element={
          <IsolatedRouteWrapper name="CommunityFeatures">
            <CommunityFeatures />
          </IsolatedRouteWrapper>
        } />
        <Route path="/family-features" element={
          <IsolatedRouteWrapper name="FamilyFeatures">
            <FamilyFeaturesPage />
          </IsolatedRouteWrapper>
        } />
        <Route path="/cultural-ai-features" element={
          <IsolatedRouteWrapper name="CulturalAIFeatures">
            <CulturalAIFeatures />
          </IsolatedRouteWrapper>
        } />
        <Route path="/voice-technology" element={
          <IsolatedRouteWrapper name="VoiceTechnology">
            <VoiceTechnology />
          </IsolatedRouteWrapper>
        } />
        <Route path="/crisis-support" element={
          <IsolatedRouteWrapper name="CrisisSupport">
            <CrisisSupport />
          </IsolatedRouteWrapper>
        } />
        <Route path="/crisis-resources" element={
          <IsolatedRouteWrapper name="CrisisResources">
            <CrisisResources />
          </IsolatedRouteWrapper>
        } />
        <Route path="/mood-tracking" element={
          <IsolatedRouteWrapper name="MoodTracking">
            <MoodTracking />
          </IsolatedRouteWrapper>
        } />
        <Route path="/integrations" element={
          <IsolatedRouteWrapper name="Integrations">
            <Integrations />
          </IsolatedRouteWrapper>
        } />
        <Route path="/community" element={
          <IsolatedRouteWrapper name="Community">
            <Community />
          </IsolatedRouteWrapper>
        } />
        <Route path="/support" element={
          <IsolatedRouteWrapper name="Support">
            <Support />
          </IsolatedRouteWrapper>
        } />
        <Route path="/help" element={
          <IsolatedRouteWrapper name="Help">
            <Help />
          </IsolatedRouteWrapper>
        } />
        <Route path="/therapy-chat" element={
          <IsolatedRouteWrapper name="TherapyChat">
            <TherapyChatPage />
          </IsolatedRouteWrapper>
        } />
        <Route path="/compare-plans" element={
          <IsolatedRouteWrapper name="ComparePlans">
            <Index />
          </IsolatedRouteWrapper>
        } />
      </Routes>
    </MinimalErrorBoundary>
  );
};

export default AppRouter;
