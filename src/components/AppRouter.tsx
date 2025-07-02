
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages with error handling
const SimpleTestPage = lazy(() => import("../components/SimpleTestPage"));
const SimpleIndex = lazy(() => import("../pages/SimpleIndex"));
const TestPage = lazy(() => import("../pages/TestPage"));

// Try to load other components with fallbacks
const safeImport = (importFn: () => Promise<any>) => {
  return lazy(() => 
    importFn().catch(() => Promise.resolve({ default: SimpleTestPage }))
  );
};

const Dashboard = safeImport(() => import("../pages/Dashboard"));
const EnhancedAuth = safeImport(() => import("../pages/EnhancedAuth"));
const EnhancedOnboardingPage = safeImport(() => import("../pages/EnhancedOnboardingPage"));

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
        <Route path="/" element={<SimpleIndex />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/simple-test" element={<SimpleTestPage />} />
        <Route path="/auth" element={<EnhancedAuth />} />
        <Route path="/onboarding" element={<EnhancedOnboardingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
