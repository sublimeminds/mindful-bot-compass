import React, { lazy, Suspense } from 'react';
import { ProgressiveEnhancer, StagedLoader } from './ProgressiveEnhancer';
import StaticChatDemo from '@/components/demo/StaticChatDemo';
import GradientLogo from '@/components/ui/GradientLogo';

// Lazy load interactive components
const InteractiveDemo = lazy(() => import('@/components/demo/ProgressiveChatDemo'));
const InteractiveHeader = lazy(() => import('@/components/navigation/EnhancedHeader'));

// Static fallback components
const StaticHeader = () => (
  <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GradientLogo size="lg" />
          <span className="text-2xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
            TherapySync
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.location.href = '/auth'}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  </header>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
    <span className="ml-3 text-therapy-600">Loading interactive features...</span>
  </div>
);

// Enhanced Index page with progressive loading
export const EnhancedIndexLoader: React.FC = () => {
  const stages = [
    {
      component: (
        <div>
          <StaticHeader />
          <main>
            <section className="py-20 bg-gradient-to-br from-therapy-50 to-calm-50">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  Sync Your Mind with AI
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Professional therapy support powered by advanced AI. Available 24/7 to help you on your mental health journey.
                </p>
                <StaticChatDemo />
              </div>
            </section>
          </main>
        </div>
      ),
      delay: 0,
      fallback: <div className="min-h-screen bg-therapy-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    },
    {
      component: (
        <div>
          <ProgressiveEnhancer fallback={<StaticHeader />} delay={2000}>
            <Suspense fallback={<StaticHeader />}>
              <InteractiveHeader />
            </Suspense>
          </ProgressiveEnhancer>
          <main>
            <section className="py-20 bg-gradient-to-br from-therapy-50 to-calm-50">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  Sync Your Mind with AI
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Professional therapy support powered by advanced AI. Available 24/7 to help you on your mental health journey.
                </p>
                <ProgressiveEnhancer fallback={<StaticChatDemo />} delay={1000}>
                  <Suspense fallback={<StaticChatDemo />}>
                    <InteractiveDemo />
                  </Suspense>
                </ProgressiveEnhancer>
              </div>
            </section>
          </main>
        </div>
      ),
      delay: 2500
    }
  ];

  return <StagedLoader stages={stages} />;
};

export default EnhancedIndexLoader;