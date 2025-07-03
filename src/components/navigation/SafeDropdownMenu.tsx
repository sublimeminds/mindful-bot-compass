import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface SafeDropdownMenuProps {
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

const SafeDropdownMenu: React.FC<SafeDropdownMenuProps> = ({ 
  trigger, 
  title, 
  items, 
  onItemClick 
}) => {
  const [isContextReady, setIsContextReady] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  useEffect(() => {
    // Progressive enhancement - wait for React context to be fully ready
    const timer = setTimeout(() => {
      setIsContextReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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

  // Fallback UI for when context isn't ready
  if (!isContextReady) {
    return (
      <Button 
        variant="ghost" 
        className="flex items-center space-x-1 hover:bg-therapy-50"
        onClick={() => onItemClick(items[0]?.href || '/')}
      >
        <trigger.icon className="h-4 w-4 text-therapy-500" />
        <span>{trigger.label}</span>
      </Button>
    );
  }

  // Enhanced dropdown with safety checks
  try {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-1 hover:bg-therapy-50">
            <trigger.icon className="h-4 w-4 text-therapy-500" />
            <span>{trigger.label}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[480px] p-4 bg-white/95 backdrop-blur shadow-xl border-0 z-[100]">
          <DropdownMenuLabel className="text-lg font-semibold mb-4 flex items-center">
            <trigger.icon className="h-5 w-5 mr-2 text-therapy-500" />
            {title}
          </DropdownMenuLabel>
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <button
                key={item.title}
                onClick={() => onItemClick(item.href)}
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
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } catch (error) {
    console.warn('SafeDropdownMenu error:', error);
    // Fallback to simple button
    return (
      <Button 
        variant="ghost" 
        className="flex items-center space-x-1 hover:bg-therapy-50"
        onClick={() => onItemClick(items[0]?.href || '/')}
      >
        <trigger.icon className="h-4 w-4 text-therapy-500" />
        <span>{trigger.label}</span>
      </Button>
    );
  }
};

export default SafeDropdownMenu;