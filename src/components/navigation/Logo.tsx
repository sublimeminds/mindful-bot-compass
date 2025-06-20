
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientLogo from '@/components/ui/GradientLogo';

const Logo = () => {
  let navigate: any = null;
  
  // Safely try to get navigate function
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn('Logo: Router context not available');
  }

  const handleClick = () => {
    if (navigate) {
      navigate("/");
    } else {
      // Fallback to window.location if router is not available
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center flex-shrink-0">
      <button 
        onClick={handleClick}
        className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group"
      >
        <div className="flex items-center justify-center transition-all duration-300 group-hover:scale-105">
          <GradientLogo 
            size="lg"
            className="drop-shadow-lg animate-swirl-breathe"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-harmony-600 via-balance-600 to-flow-600 bg-clip-text text-transparent group-hover:from-harmony-500 group-hover:to-flow-500 transition-all duration-300">
            TherapySync
          </span>
          <span className="text-xs text-muted-foreground font-medium -mt-1 group-hover:text-harmony-600 transition-colors duration-300">
            AI Therapy Companion
          </span>
        </div>
      </button>
    </div>
  );
};

export default Logo;
