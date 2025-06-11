
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-shrink-0">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group"
      >
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-therapy-500 via-therapy-600 to-calm-500 rounded-xl shadow-lg group-hover:shadow-therapy-500/30 transition-all duration-300 group-hover:scale-105">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-therapy-600 via-therapy-700 to-calm-600 bg-clip-text text-transparent">
            MindfulAI
          </span>
          <span className="text-xs text-muted-foreground font-medium -mt-1">
            Therapy Platform
          </span>
        </div>
      </button>
    </div>
  );
};

export default Logo;
