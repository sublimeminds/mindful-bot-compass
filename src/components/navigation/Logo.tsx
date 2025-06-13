
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TreeLogo from '@/components/ui/TreeLogo';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-shrink-0">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group"
      >
        <div className="flex items-center justify-center rounded-xl shadow-lg group-hover:shadow-therapy-500/30 transition-all duration-300 group-hover:scale-105 overflow-hidden">
          <TreeLogo 
            size="md"
            animated={true}
            className="drop-shadow-sm"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-therapy-600 via-therapy-700 to-calm-600 bg-clip-text text-transparent">
            TherapySync
          </span>
          <span className="text-xs text-muted-foreground font-medium -mt-1">
            AI Therapy Companion
          </span>
        </div>
      </button>
    </div>
  );
};

export default Logo;
