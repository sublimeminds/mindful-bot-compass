
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface HeaderDropdownTriggerProps {
  icon: LucideIcon | React.FC<{ className?: string; size?: number }>;
  label: string;
  className?: string;
}

const HeaderDropdownTrigger: React.FC<HeaderDropdownTriggerProps> = ({
  icon: Icon,
  label,
  className = ''
}) => {
  return (
    <button className={`
      flex items-center space-x-2 px-3 py-2 text-sm font-medium 
      text-gray-700 hover:text-therapy-700 transition-colors
      group-hover:text-therapy-700
      ${className}
    `}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
    </button>
  );
};

export default HeaderDropdownTrigger;
