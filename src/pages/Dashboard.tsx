import React, { useState } from 'react';
import { useEnhancedAuth } from '@/components/EnhancedAuthProviderV2';
import SafeErrorBoundary from '@/components/SafeErrorBoundary';

const Dashboard = () => {
  const { user, loading, signIn, signOut } = useEnhancedAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SafeErrorBoundary name="DashboardContent">
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
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 mb-2">✓ Signed in as: {user.email}</p>
                  <button 
                    onClick={signOut}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-orange-800 mb-4">You are not signed in</p>
                  {!showAuth ? (
                    <button 
                      onClick={() => setShowAuth(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Sign In / Sign Up
                    </button>
                  ) : (
                    <AuthForm onClose={() => setShowAuth(false)} />
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">AI Chat</h3>
                <p className="text-blue-700 text-sm">Start a therapy session with AI</p>
                <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Launch Chat →
                </button>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Mood Tracking</h3>
                <p className="text-green-700 text-sm">Track your daily mood</p>
                <button className="mt-3 text-green-600 hover:text-green-800 text-sm font-medium">
                  Log Mood →
                </button>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Goals</h3>
                <p className="text-purple-700 text-sm">Set and track your goals</p>
                <button className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium">
                  View Goals →
                </button>
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
    </SafeErrorBoundary>
  );
};

// Simple auth form component
const AuthForm = ({ onClose }: { onClose: () => void }) => {
  const { signIn, signUp, loading } = useEnhancedAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);
    
    if (result.error) {
      setError(result.error.message || 'Authentication failed');
    } else {
      onClose();
    }
  };

  return (
    <div className="bg-white p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
          >
            {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;