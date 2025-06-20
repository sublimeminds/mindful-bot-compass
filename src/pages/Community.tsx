
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommunityDashboard from '@/components/community/CommunityDashboard';
import { useAuth } from '@/components/SimpleAuthProvider';

const Community = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="bg-gradient-to-br from-therapy-50 to-harmony-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-therapy-900 mb-4">Join Our Community</h1>
            <p className="text-xl text-therapy-600 mb-8">
              Connect with others on their mental health journey in a safe, supportive environment.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-700 mb-6">
                Please log in to access the community features and connect with others.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-gradient-to-br from-therapy-50 to-harmony-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <CommunityDashboard />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;
