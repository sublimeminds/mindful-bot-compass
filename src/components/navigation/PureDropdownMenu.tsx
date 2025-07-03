import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface PureDropdownMenuProps {
  trigger: {
    icon: React.ComponentType<any>;
    label: string;
  };
  title: string;
  items: Array<{
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    href: string;
    gradient: string;
  }>;
  onItemClick: (href: string) => void;
}

const PureDropdownMenu: React.FC<PureDropdownMenuProps> = ({ 
  trigger, 
  title, 
  items, 
  onItemClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const IconWrapper = ({ 
    icon: Icon, 
    gradient, 
    isHovered 
  }: { 
    icon: React.ComponentType<any>; 
    gradient: string; 
    isHovered: boolean;
  }) => (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 transform ${
      isHovered 
        ? `bg-gradient-to-r ${gradient} shadow-lg scale-110 animate-pulse` 
        : `bg-gradient-to-r ${gradient} opacity-70 hover:opacity-100`
    }`}>
      <Icon className={`h-5 w-5 transition-all duration-300 ${
        isHovered ? 'text-white scale-110' : 'text-white'
      }`} />
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        className="flex items-center space-x-1 hover:bg-therapy-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <trigger.icon className="h-4 w-4 text-therapy-500" />
        <span>{trigger.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-[480px] p-4 bg-white/95 backdrop-blur shadow-xl border-0 rounded-lg z-50"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="text-lg font-semibold mb-4 flex items-center">
            <trigger.icon className="h-5 w-5 mr-2 text-therapy-500" />
            {title}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  onItemClick(item.href);
                  setIsOpen(false);
                }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-all duration-200 group w-full text-left"
                onMouseEnter={() => setHoveredIcon(item.title)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <IconWrapper 
                  icon={item.icon} 
                  gradient={item.gradient}
                  isHovered={hoveredIcon === item.title}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900 group-hover:text-therapy-700">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-tight">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PureDropdownMenu;