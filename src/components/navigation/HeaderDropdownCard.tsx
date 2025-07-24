
import React from 'react';

interface HeaderDropdownCardProps {
  children: React.ReactNode;
  className?: string;
}

const HeaderDropdownCard: React.FC<HeaderDropdownCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-[600px] p-4 bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default HeaderDropdownCard;
