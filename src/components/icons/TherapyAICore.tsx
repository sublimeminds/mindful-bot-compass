import React from 'react';

interface TherapyAICoreProps {
  className?: string;
  size?: number;
}

const TherapyAICore: React.FC<TherapyAICoreProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#therapyGradient)" />
      <path 
        d="M256 96c-35.3 0-64 28.7-64 64v32c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64h128c35.3 0 64-28.7 64-64v-96c0-35.3-28.7-64-64-64v-32c0-35.3-28.7-64-64-64zm-32 64c0-17.7 14.3-32 32-32s32 14.3 32 32v32h-64v-32zm96 96v96c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32v-96c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32z" 
        fill="white"
      />
      <circle cx="256" cy="288" r="16" fill="white" />
      <circle cx="216" cy="288" r="8" fill="white" />
      <circle cx="296" cy="288" r="8" fill="white" />
      <circle cx="256" cy="320" r="8" fill="white" />
      <path d="M240 240h32v16h-32z" fill="white" />
      <defs>
        <linearGradient id="therapyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TherapyAICore;