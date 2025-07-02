
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all pages for code splitting and performance
const Index = lazy(() => import("../pages/Index"));
const GetStarted = lazy(() => import("../pages/GetStarted"));
const EnhancedAuth = lazy(() => import("../pages/EnhancedAuth"));
const Auth = lazy(() => import("../pages/Auth"));
const EnhancedOnboardingPage = lazy(() => import("../pages/EnhancedOnboardingPage"));
const OnboardingPage = lazy(() => import("../pages/OnboardingPage"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const GoalsPage = lazy(() => import("../pages/GoalsPage"));
const EnhancedAIPersonalization = lazy(() => import("../pages/EnhancedAIPersonalization"));
const AdvancedAnalytics = lazy(() => import("../pages/AdvancedAnalytics"));
const EnhancedTherapy = lazy(() => import("../pages/EnhancedTherapy"));
const DashboardOptimization = lazy(() => import("../pages/DashboardOptimization"));
const ProductionMonitoring = lazy(() => import("../pages/ProductionMonitoring"));
const GlobalScale = lazy(() => import("../pages/GlobalScale"));
const EnterpriseB2B = lazy(() => import("../pages/EnterpriseB2B"));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-32 mx-auto" />
      <div className="animate-pulse">
        <div className="h-2 bg-therapy-200 rounded-full w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/auth" element={<EnhancedAuth />} />
        <Route path="/auth-old" element={<Auth />} />
        <Route path="/onboarding" element={<EnhancedOnboardingPage />} />
        <Route path="/onboarding-old" element={<OnboardingPage />} />
        <Route path="/onboarding-legacy" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/ai-personalization" element={<EnhancedAIPersonalization />} />
        <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
        <Route path="/enhanced-therapy" element={<EnhancedTherapy />} />
        <Route path="/dashboard-optimization" element={<DashboardOptimization />} />
        <Route path="/production-monitoring" element={<ProductionMonitoring />} />
        <Route path="/global-scale" element={<GlobalScale />} />
        <Route path="/enterprise-b2b" element={<EnterpriseB2B />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
