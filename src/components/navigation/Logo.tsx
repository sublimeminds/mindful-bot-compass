
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientLogo from '@/components/ui/GradientLogo';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex items-center cursor-pointer" 
      onClick={() => navigate('/')}
    >
      <GradientLogo size="sm" />
      <span className="ml-2 text-xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
        TherapySync
      </span>
    </div>
  );
};

export default Logo;
