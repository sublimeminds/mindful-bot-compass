
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  gradient?: boolean;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  className,
  gradient = true,
  ...props 
}) => {
  if (gradient && variant === 'default') {
    return (
      <Button
        size={size}
        className={cn(
          "bg-gradient-to-r from-therapy-500 to-calm-500 text-white hover:from-therapy-600 hover:to-calm-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }

  if (variant === 'outline') {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn(
          "border-2 border-therapy-300 text-therapy-700 hover:bg-gradient-to-r hover:from-therapy-50 hover:to-calm-50 transition-all duration-300 hover:scale-105",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("transition-all duration-300 hover:scale-105", className)}
      {...props}
    >
      {children}
    </Button>
  );
};

export default EnhancedButton;
