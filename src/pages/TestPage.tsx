import React from 'react';

const TestPage = () => {
  console.log('TestPage: Rendering test page');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-therapy-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4 therapy-text-gradient">
          Test Page Working! 🎉
        </h1>
        <p className="text-lg text-therapy-700 mb-6">
          The application is successfully loading and rendering components.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">
            If you can see this page, the routing system is working correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;