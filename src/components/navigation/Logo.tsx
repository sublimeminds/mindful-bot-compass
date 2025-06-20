
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientLogo from '@/components/ui/GradientLogo';
import SafeComponent from '@/components/SafeComponent';
import { reactChecker } from '@/utils/reactReadinessChecker';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <SafeComponent 
      componentName="Logo"
      fallback={
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-lg"></div>
          <span className="text-xl font-bold text-therapy-900">TherapySync</span>
        </div>
      }
    >
      <button
        onClick={() => {
          if (reactChecker.checkReactReadiness()) {
            navigate('/');
          }
        }}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <GradientLogo size="sm" />
        <span className="text-xl font-bold text-therapy-900">TherapySync</span>
      </button>
    </SafeComponent>
  );
};

export default Logo;
