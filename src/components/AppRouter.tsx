
import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import GetStarted from "../pages/GetStarted";
import EnhancedAuth from "../pages/EnhancedAuth";
import Auth from "../pages/Auth";
import EnhancedOnboardingPage from "../pages/EnhancedOnboardingPage";
import OnboardingPage from "../pages/OnboardingPage";
import Onboarding from "../pages/Onboarding";
import Dashboard from "../pages/Dashboard";
import GoalsPage from "../pages/GoalsPage";
import EnhancedAIPersonalization from "../pages/EnhancedAIPersonalization";
import AdvancedAnalytics from "../pages/AdvancedAnalytics";

const AppRouter = () => {
  return (
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
    </Routes>
  );
};

export default AppRouter;
