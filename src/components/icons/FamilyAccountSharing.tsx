import React from 'react';

interface FamilyAccountSharingProps {
  className?: string;
  size?: number;
}

const FamilyAccountSharing: React.FC<FamilyAccountSharingProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#familySharingGradient)" />
      
      {/* Family group */}
      <circle cx="200" cy="180" r="32" fill="white" />
      <circle cx="312" cy="180" r="32" fill="white" />
      <circle cx="256" cy="260" r="28" fill="white" />
      
      {/* Bodies */}
      <rect x="168" y="220" width="64" height="80" rx="16" fill="white" />
      <rect x="280" y="220" width="64" height="80" rx="16" fill="white" />
      <rect x="228" y="296" width="56" height="72" rx="14" fill="white" />
      
      {/* Sharing connections */}
      <line x1="232" y1="180" x2="280" y2="180" stroke="white" strokeWidth="6" />
      <line x1="220" y1="212" x2="256" y2="244" stroke="white" strokeWidth="6" />
      <line x1="292" y1="212" x2="256" y2="244" stroke="white" strokeWidth="6" />
      
      {/* Shared data symbols */}
      <circle cx="256" cy="120" r="16" fill="white" />
      <rect x="248" y="112" width="16" height="16" rx="2" fill="hsl(var(--primary))" />
      <rect x="250" y="114" width="12" height="2" rx="1" fill="white" />
      <rect x="250" y="118" width="8" height="2" rx="1" fill="white" />
      <rect x="250" y="122" width="10" height="2" rx="1" fill="white" />
      
      {/* Security lock */}
      <circle cx="380" cy="140" r="20" fill="white" />
      <rect x="372" y="148" width="16" height="16" rx="4" fill="hsl(var(--accent))" />
      <circle cx="380" cy="152" r="4" fill="white" />
      
      <defs>
        <linearGradient id="familySharingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="100%" stopColor="hsl(var(--balance-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FamilyAccountSharing;