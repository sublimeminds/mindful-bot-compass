
import React from 'react';

const EmergencyTest = () => {
  console.log('🚨 EMERGENCY: EmergencyTest component rendering');
  
  return (
    <div className="min-h-screen bg-red-500 text-white p-8">
      <h1 className="text-4xl font-bold text-center">🚨 EMERGENCY TEST COMPONENT</h1>
      <p className="text-center mt-4">If you see this, basic React rendering works</p>
      <div className="bg-white text-black p-4 mt-8 rounded">
        <h2 className="font-bold">This should be visible if:</h2>
        <ul className="list-disc ml-6 mt-2">
          <li>React Router is working</li>
          <li>The route is matching</li>
          <li>Component rendering is functional</li>
          <li>No context providers are breaking</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyTest;
