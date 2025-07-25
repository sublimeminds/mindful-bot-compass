
import React from 'react';

interface HeaderDropdownCardProps {
  children: React.ReactNode;
  className?: string;
}

const HeaderDropdownCard: React.FC<HeaderDropdownCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-[800px] md:w-[900px] p-6 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${className}`}>
      {children}
    </div>
  );
};

export default HeaderDropdownCard;
