import React from 'react';

const SimpleTestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          App Working! 🎉
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          The application is successfully loading and rendering components.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">
            All core systems are operational.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestPage;