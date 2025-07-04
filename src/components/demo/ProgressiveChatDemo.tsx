import React, { useState, useEffect, Suspense } from 'react';
import StaticChatDemo from './StaticChatDemo';

// Lazy load the interactive demo to avoid initial hook dependencies
const FunctionalChatDemo = React.lazy(() => import('./FunctionalChatDemo'));

interface Props {
  autoStart?: boolean;
}

const ProgressiveChatDemo: React.FC<Props> = ({ autoStart = false }) => {
  const [shouldLoadInteractive, setShouldLoadInteractive] = useState(false);
  const [isInteractiveReady, setIsInteractiveReady] = useState(false);
  const [userRequestedInteractive, setUserRequestedInteractive] = useState(false);

  // Progressive enhancement: Load interactive version after initial render
  useEffect(() => {
    // Wait for React to be fully initialized and page to be settled
    const timer = setTimeout(() => {
      setShouldLoadInteractive(true);
    }, 2000); // Give 2 seconds for initial page load to complete

    return () => clearTimeout(timer);
  }, []);

  // Handle user clicking to start interactive demo
  const handleStartInteractive = () => {
    setUserRequestedInteractive(true);
    if (!shouldLoadInteractive) {
      setShouldLoadInteractive(true);
    }
  };

  // Enhanced static demo with interactive trigger
  const StaticDemoWithEnhancement = () => (
    <div className="relative">
      <StaticChatDemo />
      <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-300 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
        <button
          onClick={handleStartInteractive}
          className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in"
        >
          🎭 Try Interactive Demo
        </button>
      </div>
    </div>
  );

  // Loading state for interactive demo
  const InteractiveLoading = () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden animate-scale-in">
        <div className="text-center p-6 border-b">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <svg className="h-6 w-6 text-therapy-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h3 className="text-xl font-bold">Loading Interactive Demo</h3>
          </div>
          <p className="text-sm text-gray-600">
            Preparing your personalized AI therapy experience...
          </p>
        </div>
        
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20,2A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20M8.5,7A0.5,0.5 0 0,0 8,7.5A0.5,0.5 0 0,0 8.5,8A0.5,0.5 0 0,0 9,7.5A0.5,0.5 0 0,0 8.5,7M15.5,7A0.5,0.5 0 0,0 15,7.5A0.5,0.5 0 0,0 15.5,8A0.5,0.5 0 0,0 16,7.5A0.5,0.5 0 0,0 15.5,7M12,17C14,17 15.5,15.5 15.5,13.5H8.5C8.5,15.5 10,17 12,17Z"/>
              </svg>
            </div>
            <p className="text-gray-600">Starting AI conversation engine...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error fallback for interactive demo
  const InteractiveError = () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="text-center p-6 border-b">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <svg className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-xl font-bold">Demo Temporarily Unavailable</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The interactive demo couldn't load. Here's a preview instead.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
          >
            Try Again
          </button>
        </div>
        
        <div className="p-6">
          <StaticChatDemo />
        </div>
      </div>
    </div>
  );

  // Render logic with progressive enhancement
  if (!shouldLoadInteractive || !userRequestedInteractive) {
    return <StaticDemoWithEnhancement />;
  }

  return (
    <div className="animate-fade-in">
      <Suspense fallback={<InteractiveLoading />}>
        <ErrorBoundary fallback={<InteractiveError />}>
          <div className="animate-scale-in">
            <FunctionalChatDemo autoStart={autoStart} />
          </div>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.warn('Interactive demo error (fallback to static):', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn('Interactive demo error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default ProgressiveChatDemo;