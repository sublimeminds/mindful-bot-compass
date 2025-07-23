
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface HeaderDropdownTriggerProps {
  icon: LucideIcon;
  label: string;
  isOpen?: boolean;
}

const HeaderDropdownTrigger = React.forwardRef<
  HTMLButtonElement,
  HeaderDropdownTriggerProps
>(({ icon: Icon, label, isOpen = false }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-700 transition-colors"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </Button>
  );
});

HeaderDropdownTrigger.displayName = 'HeaderDropdownTrigger';

export default HeaderDropdownTrigger;
