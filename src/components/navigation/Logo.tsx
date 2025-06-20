
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientLogo from '@/components/ui/GradientLogo';

const Logo = () => {
  // Ensure React is ready before using any hooks
  const isReactReady = React && 
    typeof React === 'object' && 
    React.useState && 
    React.useContext &&
    React.createElement;

  if (!isReactReady) {
    console.warn('Logo: React not ready, showing static logo');
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-lg"></div>
        <span className="text-xl font-bold text-therapy-900">TherapySync</span>
      </div>
    );
  }

  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
      <GradientLogo size="sm" />
      <span className="text-xl font-bold text-therapy-900">TherapySync</span>
    </button>
  );
};

export default Logo;
