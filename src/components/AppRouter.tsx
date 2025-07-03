
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/minimal" element={<MinimalIndex />} />
        <Route path="/auth" element={<EnhancedAuth />} />
        <Route path="/onboarding" element={<EnhancedOnboardingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quantum-therapy" element={<QuantumTherapy />} />
        <Route path="/blockchain-health" element={<BlockchainHealth />} />
        <Route path="/neural-interface" element={<NeuralInterface />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
