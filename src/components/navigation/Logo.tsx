
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientLogo from '@/components/ui/GradientLogo';

const Logo = () => {
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
