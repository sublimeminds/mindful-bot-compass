
import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import GetStarted from "../pages/GetStarted";
import EnhancedAuth from "../pages/EnhancedAuth";
import Auth from "../pages/Auth";
import EnhancedOnboardingPage from "../pages/EnhancedOnboardingPage";
import OnboardingPage from "../pages/OnboardingPage";
import Onboarding from "../pages/Onboarding";
import DashboardPage from "../pages/DashboardPage";
import PricingPage from "../pages/PricingPage";
import TherapyChatPage from "../pages/TherapyChatPage";
import VoiceTechnologyPage from "../pages/VoiceTechnologyPage";
import CulturalAIFeaturesPage from "../pages/CulturalAIFeaturesPage";
import FeaturesOverviewPage from "../pages/FeaturesOverviewPage";
import HowItWorksPage from "../pages/HowItWorksPage";
import FeaturesShowcasePage from "../pages/FeaturesShowcasePage";
import FamilyDashboardPage from "../pages/FamilyDashboardPage";
import CrisisSupportPage from "../pages/CrisisSupportPage";
import MoodTrackingPage from "../pages/MoodTrackingPage";
import CommunityFeaturesPage from "../pages/CommunityFeaturesPage";
import TherapyTypesPage from "../pages/TherapyTypesPage";
import IntegrationsPage from "../pages/IntegrationsPage";
import HelpPage from "../pages/HelpPage";
import SupportPage from "../pages/SupportPage";
import CrisisResourcesPage from "../pages/CrisisResourcesPage";
import CommunityPage from "../pages/CommunityPage";

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
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/therapy-chat" element={<TherapyChatPage />} />
      <Route path="/voice-technology" element={<VoiceTechnologyPage />} />
      <Route path="/cultural-ai-features" element={<CulturalAIFeaturesPage />} />
      <Route path="/features-overview" element={<FeaturesOverviewPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/features-showcase" element={<FeaturesShowcasePage />} />
      <Route path="/family-dashboard" element={<FamilyDashboardPage />} />
      <Route path="/crisis-support" element={<CrisisSupportPage />} />
      <Route path="/mood-tracking" element={<MoodTrackingPage />} />
      <Route path="/community-features" element={<CommunityFeaturesPage />} />
      <Route path="/therapy-types" element={<TherapyTypesPage />} />
      <Route path="/integrations" element={<IntegrationsPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/crisis-resources" element={<CrisisResourcesPage />} />
      <Route path="/community" element={<CommunityPage />} />
    </Routes>
  );
};

export default AppRouter;
