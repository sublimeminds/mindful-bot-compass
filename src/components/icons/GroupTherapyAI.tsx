import React from 'react';

interface GroupTherapyAIProps {
  className?: string;
  size?: number;
}

const GroupTherapyAI: React.FC<GroupTherapyAIProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#groupGradient)" />
      <circle cx="200" cy="200" r="32" fill="white" />
      <circle cx="312" cy="200" r="32" fill="white" />
      <circle cx="256" cy="260" r="32" fill="white" />
      <path 
        d="M168 272c-17.7 0-32 14.3-32 32v48h64v-48c0-17.7-14.3-32-32-32zm144 0c-17.7 0-32 14.3-32 32v48h64v-48c0-17.7-14.3-32-32-32zm-88 60c-17.7 0-32 14.3-32 32v48h64v-48c0-17.7-14.3-32-32-32z" 
        fill="white"
      />
      <line x1="200" y1="232" x2="256" y2="260" stroke="white" strokeWidth="4" />
      <line x1="312" y1="232" x2="256" y2="260" stroke="white" strokeWidth="4" />
      <defs>
        <linearGradient id="groupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GroupTherapyAI;