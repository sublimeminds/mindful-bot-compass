
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-shrink-0">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg group-hover:shadow-therapy-500/30 transition-all duration-300 group-hover:scale-105 overflow-hidden">
          <img 
            src="/lovable-uploads/3fc4b2d8-fc0a-4b0e-83a0-8c93962e00da.png" 
            alt="TherapySync Logo" 
            className="w-full h-full object-contain"
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
