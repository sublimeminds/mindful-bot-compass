
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  className,
  ...props 
}) => {
  const baseClasses = "bg-gradient-to-r from-therapy-500 to-calm-500 text-white hover:from-therapy-600 hover:to-calm-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0";
  
  if (variant === 'outline') {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn("border-2 border-therapy-300 text-therapy-700 hover:bg-gradient-to-r hover:from-therapy-50 hover:to-calm-50 transition-all duration-300 hover:scale-105", className)}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      size={size}
      className={cn(baseClasses, className)}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
