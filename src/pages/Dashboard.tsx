import React from 'react';
import { useSimpleAuth } from '@/components/SimpleAuthProvider';

const Dashboard = () => {
  const { user, signIn, signOut } = useSimpleAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Dashboard
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Welcome to your TherapySync dashboard!
            </p>
            {user ? (
              <div>
                <p className="text-green-600 mb-4">✓ You are signed in</p>
                <button 
                  onClick={signOut}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <p className="text-orange-600 mb-4">You are not signed in</p>
                <button 
                  onClick={signIn}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">AI Chat</h3>
              <p className="text-blue-700 text-sm">Start a therapy session with AI</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Mood Tracking</h3>
              <p className="text-green-700 text-sm">Track your daily mood</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Goals</h3>
              <p className="text-purple-700 text-sm">Set and track your goals</p>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => window.location.href = '/'}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;