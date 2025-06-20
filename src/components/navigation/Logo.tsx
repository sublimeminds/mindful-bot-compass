
import React from 'react';

const Logo = () => {
  return (
    <button
      onClick={() => window.location.href = '/'}
      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">T</span>
      </div>
      <span className="text-xl font-bold text-therapy-900">TherapySync</span>
    </button>
  );
};

export default Logo;
