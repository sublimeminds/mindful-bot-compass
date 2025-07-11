import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, X, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface WidgetContainerProps {
  id: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  isEditing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  onResize?: (id: string, size: 'small' | 'medium' | 'large') => void;
  className?: string;
}

const WidgetContainer = ({
  id,
  title,
  size,
  children,
  isEditing = false,
  onRemove,
  onConfigure,
  onResize,
  className
}: WidgetContainerProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'col-span-1 min-h-[200px]';
      case 'medium':
        return 'col-span-1 md:col-span-2 min-h-[250px]';
      case 'large':
        return 'col-span-1 md:col-span-2 lg:col-span-3 min-h-[320px]';
      default:
        return 'col-span-1 min-h-[200px]';
    }
  };

  return (
    <Card className={cn(
      'relative group transition-all duration-200 hover:shadow-lg',
      getSizeClasses(),
      isEditing && 'ring-2 ring-primary/20 ring-offset-2',
      className
    )}>
      {/* Widget Header */}
      <div className="flex items-center justify-between p-3 pb-2 min-h-[48px]">
        <h3 className="font-semibold text-sm text-foreground truncate">{title}</h3>
        
        {/* Widget Controls */}
        <div className={cn(
          'flex items-center space-x-1 transition-opacity',
          isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          {onConfigure && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onConfigure(id)}
            >
              <Settings className="h-3 w-3" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {onResize && (
                <>
                  <DropdownMenuItem onClick={() => onResize(id, 'small')}>
                    Small
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onResize(id, 'medium')}>
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onResize(id, 'large')}>
                    Large
                  </DropdownMenuItem>
                </>
              )}
              {onRemove && (
                <DropdownMenuItem 
                  onClick={() => onRemove(id)}
                  className="text-destructive focus:text-destructive"
                >
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isEditing && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={() => onRemove(id)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-3 pt-0 flex-1 overflow-hidden">
        {children}
      </div>

      {/* Resize Handle */}
      {isEditing && (
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-primary/20 cursor-se-resize" />
      )}
    </Card>
  );
};

export default WidgetContainer;