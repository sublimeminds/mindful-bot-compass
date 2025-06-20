
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedSystemHealthDashboard from '@/components/monitoring/EnhancedSystemHealthDashboard';

const EnhancedMonitoringPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Enhanced Monitoring...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-therapy-50 to-calm-50">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-therapy-900 mb-4">Access Denied</h1>
            <p className="text-therapy-600 mb-6">Please sign in to access enhanced monitoring.</p>
            <a 
              href="/auth" 
              className="inline-block bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Sign In
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <EnhancedSystemHealthDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default EnhancedMonitoringPage;
