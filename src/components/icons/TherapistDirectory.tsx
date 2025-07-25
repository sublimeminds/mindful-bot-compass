import React from 'react';

interface TherapistDirectoryProps {
  className?: string;
  size?: number;
}

const TherapistDirectory: React.FC<TherapistDirectoryProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#directoryGradient)" />
      
      {/* Directory book */}
      <rect x="140" y="120" width="232" height="272" rx="16" fill="white" />
      <rect x="156" y="136" width="200" height="240" rx="8" fill="hsl(var(--primary))" opacity="0.1" />
      
      {/* Therapist profiles */}
      <circle cx="200" cy="180" r="24" fill="hsl(var(--therapy-400))" />
      <rect x="240" y="164" width="80" height="8" rx="4" fill="hsl(var(--primary))" />
      <rect x="240" y="180" width="64" height="6" rx="3" fill="hsl(var(--primary))" opacity="0.6" />
      <rect x="240" y="192" width="96" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.4" />
      
      <circle cx="200" cy="240" r="24" fill="hsl(var(--calm-400))" />
      <rect x="240" y="224" width="88" height="8" rx="4" fill="hsl(var(--secondary))" />
      <rect x="240" y="240" width="72" height="6" rx="3" fill="hsl(var(--secondary))" opacity="0.6" />
      <rect x="240" y="252" width="80" height="4" rx="2" fill="hsl(var(--secondary))" opacity="0.4" />
      
      <circle cx="200" cy="300" r="24" fill="hsl(var(--mindful-400))" />
      <rect x="240" y="284" width="76" height="8" rx="4" fill="hsl(var(--accent))" />
      <rect x="240" y="300" width="68" height="6" rx="3" fill="hsl(var(--accent))" opacity="0.6" />
      <rect x="240" y="312" width="92" height="4" rx="2" fill="hsl(var(--accent))" opacity="0.4" />
      
      {/* Rating stars */}
      <path d="M280 200 L284 208 L292 208 L286 213 L288 221 L280 216 L272 221 L274 213 L268 208 L276 208 Z" fill="hsl(var(--warning))" />
      <path d="M295 200 L299 208 L307 208 L301 213 L303 221 L295 216 L287 221 L289 213 L283 208 L291 208 Z" fill="hsl(var(--warning))" />
      <path d="M310 200 L314 208 L322 208 L316 213 L318 221 L310 216 L302 221 L304 213 L298 208 L306 208 Z" fill="hsl(var(--warning))" />
      
      {/* Search icon */}
      <circle cx="400" cy="160" r="20" fill="white" />
      <circle cx="400" cy="160" r="12" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
      <line x1="409" y1="169" x2="418" y2="178" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="directoryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="50%" stopColor="hsl(var(--calm-500))" />
          <stop offset="100%" stopColor="hsl(var(--mindful-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TherapistDirectory;