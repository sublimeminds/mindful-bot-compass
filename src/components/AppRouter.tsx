
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import SafeErrorBoundary from "@/components/SafeErrorBoundary";
import BulletproofErrorBoundary from "@/components/BulletproofErrorBoundary";

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
const QuantumTherapy = createSafeLazyComponent(() => import("../pages/QuantumTherapy"), "QuantumTherapy");
const BlockchainHealth = createSafeLazyComponent(() => import("../pages/BlockchainHealth"), "BlockchainHealth");
const NeuralInterface = createSafeLazyComponent(() => import("../pages/NeuralInterface"), "NeuralInterface");
const TestPage = createSafeLazyComponent(() => import("../pages/TestPage"), "TestPage");
const ComponentHealthCheck = createSafeLazyComponent(() => import("../pages/ComponentHealthCheck"), "ComponentHealthCheck");
const UserControlledRecoveryDashboard = createSafeLazyComponent(() => import("../components/UserControlledRecoveryDashboard"), "RecoveryDashboard");
const RecoveryMonitoringDashboard = createSafeLazyComponent(() => import("../components/analytics/RecoveryMonitoringDashboard"), "RecoveryMonitoring");

// Enhanced loading fallback
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading page...</p>
    </div>
  </div>
);

// Enhanced route wrapper with better error detection
const RouteWrapper: React.FC<{ children: React.ReactNode; name: string }> = ({ children, name }) => {
  
  // Validate route dependencies before rendering
  React.useEffect(() => {
    console.log(`RouteWrapper: Rendering ${name} page`);
    
    // Check critical dependencies
    if (!React || typeof React.useState !== 'function') {
      console.error(`RouteWrapper: React hooks not available for ${name}`);
      return;
    }
    
    // Check router availability
    if (typeof window === 'undefined' || !window.location) {
      console.error(`RouteWrapper: Window/location not available for ${name}`);
      return;
    }
    
    console.log(`RouteWrapper: ${name} dependencies validated successfully`);
  }, [name]);

  return (
    <SafeErrorBoundary 
      name={`${name}Route`}
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-600 mb-4">Page Error</h2>
            <p className="text-gray-600 mb-6">
              The {name} page encountered an error and couldn't load properly.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-therapy-600 text-white px-4 py-2 rounded hover:bg-therapy-700 transition-colors"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Error ID: {name}Route-{Date.now()}
            </p>
          </div>
        </div>
      }
    >
      {children}
    </SafeErrorBoundary>
  );
};

const AppRouter = () => {
  return (
    <BulletproofErrorBoundary>
      <SafeErrorBoundary name="RouterContainer">
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
          </Routes>
        </Suspense>
      </SafeErrorBoundary>
    </BulletproofErrorBoundary>
  );
};

export default AppRouter;
