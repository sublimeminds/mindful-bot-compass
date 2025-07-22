
import React from 'react';

const SimpleHeader = () => {
  console.log('🔍 SimpleHeader: Component rendering');
  
  return (
    <header className="w-full bg-red-500 text-white p-4 border-b-4 border-blue-500">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">SIMPLE HEADER - VISIBLE TEST</h1>
        <p>If you can see this, the header layout structure works</p>
      </div>
    </header>
  );
};

export default SimpleHeader;
