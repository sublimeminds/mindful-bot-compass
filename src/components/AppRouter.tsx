
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SafeErrorBoundary from "@/components/SafeErrorBoundary";

// Lazy load pages with safe fallbacks
const Index = lazy(() => import("../pages/Index"));
const MinimalIndex = lazy(() => import("../pages/MinimalIndex"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const EnhancedAuth = lazy(() => import("../pages/EnhancedAuth"));
const EnhancedOnboardingPage = lazy(() => import("../pages/EnhancedOnboardingPage"));
const QuantumTherapy = lazy(() => import("../pages/QuantumTherapy"));
const BlockchainHealth = lazy(() => import("../pages/BlockchainHealth"));
const NeuralInterface = lazy(() => import("../pages/NeuralInterface"));
const TestPage = lazy(() => import("../pages/TestPage"));
const ComponentHealthCheck = lazy(() => import("../pages/ComponentHealthCheck"));

// Simple loading fallback
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <SafeErrorBoundary name="AppRouter">
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={
            <SafeErrorBoundary name="IndexPage">
              <Index />
            </SafeErrorBoundary>
          } />
          <Route path="/minimal" element={
            <SafeErrorBoundary name="MinimalIndexPage">
              <MinimalIndex />
            </SafeErrorBoundary>
          } />
          <Route path="/auth" element={
            <SafeErrorBoundary name="AuthPage">
              <EnhancedAuth />
            </SafeErrorBoundary>
          } />
          <Route path="/onboarding" element={
            <SafeErrorBoundary name="OnboardingPage">
              <EnhancedOnboardingPage />
            </SafeErrorBoundary>
          } />
          <Route path="/dashboard" element={
            <SafeErrorBoundary name="DashboardPage">
              <Dashboard />
            </SafeErrorBoundary>
          } />
          <Route path="/quantum-therapy" element={
            <SafeErrorBoundary name="QuantumTherapyPage">
              <QuantumTherapy />
            </SafeErrorBoundary>
          } />
          <Route path="/blockchain-health" element={
            <SafeErrorBoundary name="BlockchainHealthPage">
              <BlockchainHealth />
            </SafeErrorBoundary>
          } />
          <Route path="/neural-interface" element={
            <SafeErrorBoundary name="NeuralInterfacePage">
              <NeuralInterface />
            </SafeErrorBoundary>
          } />
          <Route path="/test" element={
            <SafeErrorBoundary name="TestPage">
              <TestPage />
            </SafeErrorBoundary>
          } />
          <Route path="/component-health" element={
            <SafeErrorBoundary name="ComponentHealthPage">
              <ComponentHealthCheck />
            </SafeErrorBoundary>
          } />
        </Routes>
      </Suspense>
    </SafeErrorBoundary>
  );
};

export default AppRouter;
