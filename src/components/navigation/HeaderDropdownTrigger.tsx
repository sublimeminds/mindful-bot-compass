import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface HeaderDropdownTriggerProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

const HeaderDropdownTrigger: React.FC<HeaderDropdownTriggerProps> = ({
  icon: Icon,
  label,
  className = ''
}) => {
  return (
    <Button 
      variant="ghost" 
      className={`
        flex items-center space-x-2 px-3 py-2 h-10
        hover:bg-therapy-50/80 text-gray-900 
        transition-all duration-200 ease-out
        hover:scale-105 transform-gpu
        group/trigger
        ${className}
      `}
    >
      <Icon className="h-4 w-4 text-therapy-500 group-hover/trigger:text-therapy-600 transition-colors" />
      <span className="font-medium text-sm">{label}</span>
      <ChevronDown className="h-3.5 w-3.5 text-gray-500 group-hover/trigger:text-gray-600 transition-all duration-200 group-hover/trigger:rotate-180" />
    </Button>
  );
};

export default HeaderDropdownTrigger;