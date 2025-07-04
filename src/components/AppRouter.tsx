
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MinimalErrorBoundary from "@/components/MinimalErrorBoundary";

// Safe fallback for failed lazy loads
const SafeFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Page Loading Error</h2>
      <p className="text-gray-600 mb-4">This page couldn't load properly.</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  </div>
);

// Lazy load pages with safe fallbacks
const createSafeLazyComponent = (importFn: () => Promise<any>, fallbackName: string) => {
  return lazy(() => 
    importFn().catch((error) => {
      console.error(`Failed to load ${fallbackName}:`, error);
      return { default: SafeFallback };
    })
  );
};

const Index = createSafeLazyComponent(() => import("../pages/Index"), "Index");
const MinimalIndex = createSafeLazyComponent(() => import("../pages/MinimalIndex"), "MinimalIndex");
const Dashboard = createSafeLazyComponent(() => import("../pages/Dashboard"), "Dashboard");
const EnhancedAuth = createSafeLazyComponent(() => import("../pages/EnhancedAuth"), "EnhancedAuth");
const EnhancedOnboardingPage = createSafeLazyComponent(() => import("../pages/EnhancedOnboardingPage"), "EnhancedOnboardingPage");
const Pricing = createSafeLazyComponent(() => import("../pages/Pricing"), "Pricing");
const FeaturesOverview = createSafeLazyComponent(() => import("../pages/FeaturesOverview"), "FeaturesOverview");
const HowItWorks = createSafeLazyComponent(() => import("../pages/HowItWorks"), "HowItWorks");
const FeaturesShowcase = createSafeLazyComponent(() => import("../pages/FeaturesShowcase"), "FeaturesShowcase");
const TherapyTypes = createSafeLazyComponent(() => import("../pages/TherapyTypes"), "TherapyTypes");
const CommunityFeatures = createSafeLazyComponent(() => import("../pages/CommunityFeatures"), "CommunityFeatures");
const FamilyFeaturesPage = createSafeLazyComponent(() => import("../pages/FamilyFeaturesPage"), "FamilyFeaturesPage");
const CulturalAIFeatures = createSafeLazyComponent(() => import("../pages/CulturalAIFeatures"), "CulturalAIFeatures");
const VoiceTechnology = createSafeLazyComponent(() => import("../pages/VoiceTechnology"), "VoiceTechnology");
const CrisisSupport = createSafeLazyComponent(() => import("../pages/CrisisSupport"), "CrisisSupport");
const CrisisResources = createSafeLazyComponent(() => import("../pages/CrisisResources"), "CrisisResources");
const MoodTracking = createSafeLazyComponent(() => import("../pages/MoodTracking"), "MoodTracking");
const Integrations = createSafeLazyComponent(() => import("../pages/Integrations"), "Integrations");
const Community = createSafeLazyComponent(() => import("../pages/Community"), "Community");
const Support = createSafeLazyComponent(() => import("../pages/Support"), "Support");
const Help = createSafeLazyComponent(() => import("../pages/Help"), "Help");
const TherapyChatPage = createSafeLazyComponent(() => import("../pages/TherapyChatPage"), "TherapyChatPage");
const QuantumTherapy = createSafeLazyComponent(() => import("../pages/QuantumTherapy"), "QuantumTherapy");
const BlockchainHealth = createSafeLazyComponent(() => import("../pages/BlockchainHealth"), "BlockchainHealth");
const NeuralInterface = createSafeLazyComponent(() => import("../pages/NeuralInterface"), "NeuralInterface");
const TestPage = createSafeLazyComponent(() => import("../pages/TestPage"), "TestPage");
const ComponentHealthCheck = createSafeLazyComponent(() => import("../pages/ComponentHealthCheck"), "ComponentHealthCheck");
const UserControlledRecoveryDashboard = createSafeLazyComponent(() => import("../components/UserControlledRecoveryDashboard"), "RecoveryDashboard");
const RecoveryMonitoringDashboard = createSafeLazyComponent(() => import("../components/analytics/RecoveryMonitoringDashboard"), "RecoveryMonitoring");

// Enhanced loading fallback with TherapySync branding
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative mb-6">
        {/* Gradient swirl loading animation */}
        <div className="w-16 h-16 relative animate-spin">
          <div className="absolute inset-0 bg-gradient-to-br from-therapy-500 via-calm-500 to-therapy-600 rounded-full opacity-80"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-white/30 via-transparent to-white/20 rounded-full"></div>
          <div className="absolute inset-4 bg-white/90 rounded-full animate-pulse"></div>
        </div>
      </div>
      <h2 className="text-xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent mb-2">
        TherapySync
      </h2>
      <p className="text-therapy-600/70">Loading...</p>
    </div>
  </div>
);

// Simplified route wrapper
const RouteWrapper: React.FC<{ children: React.ReactNode; name: string }> = ({ children, name }) => {
  console.log(`RouteWrapper: Rendering ${name} page`);
  return children;
};

const AppRouter = () => {
  return (
    <MinimalErrorBoundary>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
            <Route path="/" element={
              <RouteWrapper name="Index">
                <Index />
              </RouteWrapper>
            } />
            <Route path="/minimal" element={
              <RouteWrapper name="MinimalIndex">
                <MinimalIndex />
              </RouteWrapper>
            } />
            <Route path="/auth" element={
              <RouteWrapper name="Auth">
                <EnhancedAuth />
              </RouteWrapper>
            } />
            <Route path="/onboarding" element={
              <RouteWrapper name="Onboarding">
                <EnhancedOnboardingPage />
              </RouteWrapper>
            } />
            <Route path="/dashboard" element={
              <RouteWrapper name="Dashboard">
                <Dashboard />
              </RouteWrapper>
            } />
            <Route path="/quantum-therapy" element={
              <RouteWrapper name="QuantumTherapy">
                <QuantumTherapy />
              </RouteWrapper>
            } />
            <Route path="/blockchain-health" element={
              <RouteWrapper name="BlockchainHealth">
                <BlockchainHealth />
              </RouteWrapper>
            } />
            <Route path="/neural-interface" element={
              <RouteWrapper name="NeuralInterface">
                <NeuralInterface />
              </RouteWrapper>
            } />
            <Route path="/test" element={
              <RouteWrapper name="Test">
                <TestPage />
              </RouteWrapper>
            } />
            <Route path="/component-health" element={
              <RouteWrapper name="ComponentHealth">
                <ComponentHealthCheck />
              </RouteWrapper>
            } />
            <Route path="/recovery-dashboard" element={
              <RouteWrapper name="RecoveryDashboard">
                <UserControlledRecoveryDashboard />
              </RouteWrapper>
            } />
            <Route path="/recovery-monitoring" element={
              <RouteWrapper name="RecoveryMonitoring">
                <RecoveryMonitoringDashboard />
              </RouteWrapper>
            } />
            <Route path="/pricing" element={
              <RouteWrapper name="Pricing">
                <Pricing />
              </RouteWrapper>
            } />
            <Route path="/features-overview" element={
              <RouteWrapper name="FeaturesOverview">
                <FeaturesOverview />
              </RouteWrapper>
            } />
            <Route path="/how-it-works" element={
              <RouteWrapper name="HowItWorks">
                <HowItWorks />
              </RouteWrapper>
            } />
            <Route path="/features-showcase" element={
              <RouteWrapper name="FeaturesShowcase">
                <FeaturesShowcase />
              </RouteWrapper>
            } />
            <Route path="/therapy-types" element={
              <RouteWrapper name="TherapyTypes">
                <TherapyTypes />
              </RouteWrapper>
            } />
            <Route path="/community-features" element={
              <RouteWrapper name="CommunityFeatures">
                <CommunityFeatures />
              </RouteWrapper>
            } />
            <Route path="/family-features" element={
              <RouteWrapper name="FamilyFeatures">
                <FamilyFeaturesPage />
              </RouteWrapper>
            } />
            <Route path="/cultural-ai-features" element={
              <RouteWrapper name="CulturalAIFeatures">
                <CulturalAIFeatures />
              </RouteWrapper>
            } />
            <Route path="/voice-technology" element={
              <RouteWrapper name="VoiceTechnology">
                <VoiceTechnology />
              </RouteWrapper>
            } />
            <Route path="/crisis-support" element={
              <RouteWrapper name="CrisisSupport">
                <CrisisSupport />
              </RouteWrapper>
            } />
            <Route path="/crisis-resources" element={
              <RouteWrapper name="CrisisResources">
                <CrisisResources />
              </RouteWrapper>
            } />
            <Route path="/mood-tracking" element={
              <RouteWrapper name="MoodTracking">
                <MoodTracking />
              </RouteWrapper>
            } />
            <Route path="/integrations" element={
              <RouteWrapper name="Integrations">
                <Integrations />
              </RouteWrapper>
            } />
            <Route path="/community" element={
              <RouteWrapper name="Community">
                <Community />
              </RouteWrapper>
            } />
            <Route path="/support" element={
              <RouteWrapper name="Support">
                <Support />
              </RouteWrapper>
            } />
            <Route path="/help" element={
              <RouteWrapper name="Help">
                <Help />
              </RouteWrapper>
            } />
            <Route path="/therapy-chat" element={
              <RouteWrapper name="TherapyChat">
                <TherapyChatPage />
              </RouteWrapper>
            } />
          </Routes>
        </Suspense>
    </MinimalErrorBoundary>
  );
};

export default AppRouter;
