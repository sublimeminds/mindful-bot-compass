
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TreeLogo from '@/components/ui/TreeLogo';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-shrink-0">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center space-x-4 hover:opacity-90 transition-all duration-300 group"
      >
        <div className="flex items-center justify-center transition-all duration-300 group-hover:scale-105">
          <TreeLogo 
            size="xl"
            className="drop-shadow-lg"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-therapy-600 via-therapy-700 to-calm-600 bg-clip-text text-transparent group-hover:from-therapy-500 group-hover:to-calm-500 transition-all duration-300">
            TherapySync
          </span>
          <span className="text-sm text-muted-foreground font-medium -mt-1 group-hover:text-therapy-600 transition-colors duration-300">
            AI Therapy Companion
          </span>
        </div>
      </button>
    </div>
  );
};

export default Logo;
