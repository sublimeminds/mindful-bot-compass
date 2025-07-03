import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            TherapySync
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-Powered Mental Health Support - Your personal therapy companion available 24/7
          </p>
          <button 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/dashboard'}
          >
            Get Started
          </button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-blue-600 text-xl font-bold">🧠</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Therapy</h3>
            <p className="text-gray-600">Advanced AI-powered therapy sessions personalized for you</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-green-600 text-xl font-bold">🎧</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Voice Support</h3>
            <p className="text-gray-600">Natural voice conversations with emotion detection</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-purple-600 text-xl font-bold">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Crisis Support</h3>
            <p className="text-gray-600">Immediate crisis intervention and safety planning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;