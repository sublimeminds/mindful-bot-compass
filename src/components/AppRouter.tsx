import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Direct imports for core pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";

// Lazy load feature pages for better performance
const FeaturesOverview = React.lazy(() => import("@/pages/FeaturesOverview"));
const TherapyTypes = React.lazy(() => import("@/pages/TherapyTypes"));
const Plans = React.lazy(() => import("@/pages/Plans"));
const HowItWorks = React.lazy(() => import("@/pages/HowItWorks"));
const FeaturesShowcase = React.lazy(() => import("@/pages/FeaturesShowcase"));
const CommunityFeatures = React.lazy(() => import("@/pages/CommunityFeatures"));
const FamilyFeaturesPage = React.lazy(() => import("@/pages/FamilyFeaturesPage"));
const CulturalAIFeatures = React.lazy(() => import("@/pages/CulturalAIFeatures"));
const VoiceTechnology = React.lazy(() => import("@/pages/VoiceTechnology"));
const CrisisSupport = React.lazy(() => import("@/pages/CrisisSupport"));
const CrisisResources = React.lazy(() => import("@/pages/CrisisResources"));
const MoodTracking = React.lazy(() => import("@/pages/MoodTracking"));
const Integrations = React.lazy(() => import("@/pages/Integrations"));
const Community = React.lazy(() => import("@/pages/Community"));
const Support = React.lazy(() => import("@/pages/Support"));
const Help = React.lazy(() => import("@/pages/Help"));
const TherapyChat = React.lazy(() => import("@/pages/TherapyChat"));
const ComparePlans = React.lazy(() => import("@/pages/ComparePlans"));
const Onboarding = React.lazy(() => import("@/pages/Onboarding"));
const ADHDTherapy = React.lazy(() => import("@/pages/ADHDTherapy"));
const CouplesTherapy = React.lazy(() => import("@/pages/CouplesTherapy"));
const LGBTQTherapy = React.lazy(() => import("@/pages/LGBTQTherapy"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const Goals = React.lazy(() => import("@/pages/Goals"));
const Analytics = React.lazy(() => import("@/pages/Analytics"));
const Sessions = React.lazy(() => import("@/pages/Sessions"));
const Notebook = React.lazy(() => import("@/pages/Notebook"));
const Techniques = React.lazy(() => import("@/pages/Techniques"));
const AudioLibrary = React.lazy(() => import("@/pages/AudioLibrary"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const FAQ = React.lazy(() => import("@/pages/FAQ"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

// Loading component for lazy-loaded pages
const PageLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
      <p className="text-therapy-600 font-medium">Loading page...</p>
    </div>
  </div>
);

// Simple error boundary component
class SimpleErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Route error:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
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
    }
    return this.props.children;
  }
}

const AppRouter = () => {
  console.log('AppRouter: Loading full application with all pages');
  
  return (
    <SimpleErrorBoundary>
      <Routes>
        {/* Core pages - direct imports for fast loading */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Feature pages - lazy loaded */}
        <Route path="/features-overview" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <FeaturesOverview />
          </Suspense>
        } />
        <Route path="/therapy-types" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <TherapyTypes />
          </Suspense>
        } />
        <Route path="/pricing" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Plans />
          </Suspense>
        } />
        <Route path="/plans" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Plans />
          </Suspense>
        } />
        <Route path="/how-it-works" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <HowItWorks />
          </Suspense>
        } />
        <Route path="/features-showcase" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <FeaturesShowcase />
          </Suspense>
        } />
        <Route path="/community-features" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <CommunityFeatures />
          </Suspense>
        } />
        <Route path="/family-features" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <FamilyFeaturesPage />
          </Suspense>
        } />
        <Route path="/cultural-ai-features" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <CulturalAIFeatures />
          </Suspense>
        } />
        <Route path="/voice-technology" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <VoiceTechnology />
          </Suspense>
        } />
        <Route path="/crisis-support" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <CrisisSupport />
          </Suspense>
        } />
        <Route path="/crisis-resources" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <CrisisResources />
          </Suspense>
        } />
        <Route path="/mood-tracking" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <MoodTracking />
          </Suspense>
        } />
        <Route path="/integrations" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Integrations />
          </Suspense>
        } />
        <Route path="/community" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Community />
          </Suspense>
        } />
        <Route path="/support" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Support />
          </Suspense>
        } />
        <Route path="/help" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Help />
          </Suspense>
        } />
        <Route path="/therapy-chat" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <TherapyChat />
          </Suspense>
        } />
        <Route path="/compare-plans" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ComparePlans />
          </Suspense>
        } />
        <Route path="/onboarding" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Onboarding />
          </Suspense>
        } />
        
        {/* Therapy specializations */}
        <Route path="/adhd-therapy" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ADHDTherapy />
          </Suspense>
        } />
        <Route path="/couples-therapy" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <CouplesTherapy />
          </Suspense>
        } />
        <Route path="/lgbtq-therapy" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <LGBTQTherapy />
          </Suspense>
        } />
        
        {/* User dashboard pages */}
        <Route path="/profile" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Profile />
          </Suspense>
        } />
        <Route path="/settings" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Settings />
          </Suspense>
        } />
        <Route path="/goals" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Goals />
          </Suspense>
        } />
        <Route path="/analytics" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Analytics />
          </Suspense>
        } />
        <Route path="/sessions" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Sessions />
          </Suspense>
        } />
        <Route path="/notebook" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Notebook />
          </Suspense>
        } />
        <Route path="/techniques" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Techniques />
          </Suspense>
        } />
        <Route path="/audio-library" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AudioLibrary />
          </Suspense>
        } />
        
        {/* Support pages */}
        <Route path="/contact" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Contact />
          </Suspense>
        } />
        <Route path="/faq" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <FAQ />
          </Suspense>
        } />
        
        {/* Catch all other routes */}
        <Route path="*" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </SimpleErrorBoundary>
  );
};

export default AppRouter;