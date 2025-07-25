import React from 'react';

interface AITherapyChatProps {
  className?: string;
  size?: number;
}

const AITherapyChat: React.FC<AITherapyChatProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#chatGradient)" />
      <path 
        d="M160 176c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32h24l40 48 40-48h88c17.7 0 32-14.3 32-32V208c0-17.7-14.3-32-32-32H160z" 
        fill="white"
      />
      <circle cx="200" cy="248" r="12" fill="#1E40AF" />
      <circle cx="256" cy="248" r="12" fill="#1E40AF" />
      <circle cx="312" cy="248" r="12" fill="#1E40AF" />
      <path d="M190 280h132v16H190z" fill="#1E40AF" />
      <path d="M190 304h100v16H190z" fill="#1E40AF" />
      <defs>
        <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AITherapyChat;