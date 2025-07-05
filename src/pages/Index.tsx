import React from 'react';
import StaticIndexContent from '@/components/StaticIndexContent';

// Simple error boundary for Index page
class IndexErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Index page error:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
            <h1 className="text-2xl font-bold text-therapy-600 mb-4">TherapySync</h1>
            <p className="text-slate-600 mb-4">Loading your wellness journey...</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-therapy-600 text-white px-6 py-2 rounded-lg hover:bg-therapy-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const IndexContent = () => {
  return (
    <IndexErrorBoundary>
      <StaticIndexContent />
    </IndexErrorBoundary>
  );
};

const Index = () => {
  console.log('Index: Loading static index page');
  return <IndexContent />;
};

export default Index;