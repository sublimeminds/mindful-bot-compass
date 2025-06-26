
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, HelpCircle } from 'lucide-react';

interface ContextualTooltipProps {
  children: React.ReactNode;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  className?: string;
}

const ContextualTooltip = ({
  children,
  title,
  content,
  position = 'top',
  trigger = 'hover',
  className = ''
}: ContextualTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let newPosition = position;

      // Check if tooltip would go off screen and adjust position
      if (position === 'top' && triggerRect.top - tooltipRect.height < 0) {
        newPosition = 'bottom';
      } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > viewport.height) {
        newPosition = 'top';
      } else if (position === 'left' && triggerRect.left - tooltipRect.width < 0) {
        newPosition = 'right';
      } else if (position === 'right' && triggerRect.right + tooltipRect.width > viewport.width) {
        newPosition = 'left';
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  const handleShow = () => setIsVisible(true);
  const handleHide = () => setIsVisible(false);

  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50 w-64';
    switch (actualPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
    }
  };

  const triggerProps = trigger === 'hover' 
    ? { onMouseEnter: handleShow, onMouseLeave: handleHide }
    : { onClick: () => setIsVisible(!isVisible) };

  return (
    <div ref={triggerRef} className={`relative inline-block ${className}`} {...triggerProps}>
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={getPositionClasses()}
          onMouseEnter={trigger === 'hover' ? handleShow : undefined}
          onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        >
          <Card className="border-therapy-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-therapy-600" />
                  <h4 className="font-semibold text-sm">{title}</h4>
                </div>
                {trigger === 'click' && (
                  <Button variant="ghost" size="sm" onClick={handleHide}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{content}</p>
            </CardContent>
          </Card>
          
          {/* Arrow */}
          <div className={`absolute w-0 h-0 ${
            actualPosition === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-white' :
            actualPosition === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-white' :
            actualPosition === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-white' :
            'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-white'
          }`} />
        </div>
      )}
    </div>
  );
};

export default ContextualTooltip;
