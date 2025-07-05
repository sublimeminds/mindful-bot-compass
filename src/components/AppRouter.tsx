import React from "react";
import { Routes, Route } from "react-router-dom";
import StaticIndexContent from "@/components/StaticIndexContent";
import StaticAuthForm from "@/components/auth/StaticAuthForm";

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

// Emergency minimal pages that always work
const MinimalHomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
    <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-2xl">
      <h1 className="text-4xl font-bold text-therapy-600 mb-4">TherapySync</h1>
      <p className="text-xl text-slate-600 mb-6">AI-Powered Mental Health Support</p>
      <div className="space-y-4">
        <button 
          onClick={() => window.location.href = '/auth'}
          className="w-full bg-therapy-600 text-white px-6 py-3 rounded-lg hover:bg-therapy-700 transition-colors font-semibold"
        >
          Sign In / Sign Up
        </button>
        <button 
          onClick={() => window.location.href = '/demo'}
          className="w-full border border-therapy-600 text-therapy-600 px-6 py-3 rounded-lg hover:bg-therapy-50 transition-colors font-semibold"
        >
          Try Demo
        </button>
      </div>
    </div>
  </div>
);

const MinimalDemoPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
    <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-2xl">
      <h1 className="text-3xl font-bold text-therapy-600 mb-4">AI Therapy Demo</h1>
      <p className="text-lg text-slate-600 mb-6">Experience our AI-powered mental health support</p>
      <div className="bg-therapy-50 p-6 rounded-lg mb-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg text-left">
            <p className="text-sm text-slate-500 mb-2">You:</p>
            <p className="text-slate-800">I've been feeling anxious lately...</p>
          </div>
          <div className="bg-therapy-100 p-4 rounded-lg text-left">
            <p className="text-sm text-therapy-600 mb-2">AI Therapist:</p>
            <p className="text-slate-800">I understand that anxiety can feel overwhelming. Can you tell me more about what's been triggering these feelings?</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <button 
          onClick={() => window.location.href = '/auth'}
          className="w-full bg-therapy-600 text-white px-6 py-3 rounded-lg hover:bg-therapy-700 transition-colors font-semibold"
        >
          Start Your Journey
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full border border-therapy-600 text-therapy-600 px-6 py-3 rounded-lg hover:bg-therapy-50 transition-colors font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

const MinimalDashboardPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
    <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-2xl">
      <h1 className="text-3xl font-bold text-therapy-600 mb-4">Dashboard</h1>
      <p className="text-lg text-slate-600 mb-6">Your mental health journey dashboard</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-therapy-50 p-4 rounded-lg">
          <h3 className="font-semibold text-therapy-700">Sessions</h3>
          <p className="text-2xl font-bold text-therapy-600">12</p>
        </div>
        <div className="bg-calm-50 p-4 rounded-lg">
          <h3 className="font-semibold text-calm-700">Mood Score</h3>
          <p className="text-2xl font-bold text-calm-600">7.2</p>
        </div>
      </div>
      <div className="space-y-4">
        <button 
          onClick={() => window.location.href = '/demo'}
          className="w-full bg-therapy-600 text-white px-6 py-3 rounded-lg hover:bg-therapy-700 transition-colors font-semibold"
        >
          Start New Session
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full border border-therapy-600 text-therapy-600 px-6 py-3 rounded-lg hover:bg-therapy-50 transition-colors font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

const MinimalErrorPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
    <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
      <h2 className="text-2xl font-bold text-therapy-600 mb-4">Page Not Found</h2>
      <p className="text-slate-600 mb-4">This page doesn't exist or couldn't load.</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-therapy-600 text-white px-6 py-3 rounded-lg hover:bg-therapy-700 transition-colors font-semibold"
      >
        Go Home
      </button>
    </div>
  </div>
);

const AppRouter = () => {
  console.log('AppRouter: Loading simplified emergency router');
  
  return (
    <SimpleErrorBoundary>
      <Routes>
        {/* Main pages with working static content */}
        <Route path="/" element={<StaticIndexContent />} />
        <Route path="/auth" element={<StaticAuthForm />} />
        <Route path="/demo" element={<MinimalDemoPage />} />
        <Route path="/dashboard" element={<MinimalDashboardPage />} />
        
        {/* Fallback minimal pages for other routes */}
        <Route path="/minimal" element={<MinimalHomePage />} />
        <Route path="/onboarding" element={<MinimalHomePage />} />
        <Route path="/pricing" element={<MinimalHomePage />} />
        <Route path="/features-overview" element={<MinimalHomePage />} />
        <Route path="/how-it-works" element={<MinimalHomePage />} />
        <Route path="/features-showcase" element={<MinimalHomePage />} />
        <Route path="/therapy-types" element={<MinimalHomePage />} />
        <Route path="/community-features" element={<MinimalHomePage />} />
        <Route path="/family-features" element={<MinimalHomePage />} />
        <Route path="/cultural-ai-features" element={<MinimalHomePage />} />
        <Route path="/voice-technology" element={<MinimalHomePage />} />
        <Route path="/crisis-support" element={<MinimalHomePage />} />
        <Route path="/crisis-resources" element={<MinimalHomePage />} />
        <Route path="/mood-tracking" element={<MinimalHomePage />} />
        <Route path="/integrations" element={<MinimalHomePage />} />
        <Route path="/community" element={<MinimalHomePage />} />
        <Route path="/support" element={<MinimalHomePage />} />
        <Route path="/help" element={<MinimalHomePage />} />
        <Route path="/therapy-chat" element={<MinimalDemoPage />} />
        <Route path="/compare-plans" element={<MinimalHomePage />} />
        
        {/* Catch all other routes */}
        <Route path="*" element={<MinimalErrorPage />} />
      </Routes>
    </SimpleErrorBoundary>
  );
};

export default AppRouter;