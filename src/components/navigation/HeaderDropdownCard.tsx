
import React from 'react';

interface HeaderDropdownCardProps {
  children: React.ReactNode;
}

const HeaderDropdownCard: React.FC<HeaderDropdownCardProps> = ({ children }) => {
  return (
    <div className="w-[600px] p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      {children}
    </div>
  );
};

export default HeaderDropdownCard;
