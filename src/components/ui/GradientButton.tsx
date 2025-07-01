
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'harmony' | 'balance' | 'flow';
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
  const getGradientClasses = (variant: string) => {
    switch (variant) {
      case 'harmony':
        return "bg-gradient-to-r from-harmony-500 via-therapy-500 to-flow-500 text-white hover:from-harmony-600 hover:via-therapy-600 hover:to-flow-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300";
      case 'balance':
        return "bg-gradient-to-r from-balance-500 via-calm-500 to-therapy-500 text-white hover:from-balance-600 hover:via-calm-600 hover:to-therapy-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300";
      case 'flow':
        return "bg-gradient-to-r from-flow-500 via-harmony-500 to-balance-500 text-white hover:from-flow-600 hover:via-harmony-600 hover:to-balance-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300";
      case 'outline':
        return "border-2 border-therapy-300 bg-white/90 text-therapy-700 hover:bg-therapy-50 hover:text-therapy-800 hover:border-therapy-400 shadow-md hover:shadow-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300";
      case 'ghost':
        return "text-therapy-600 hover:bg-therapy-50 hover:text-therapy-800 hover:shadow-md transform hover:scale-105 transition-all duration-300";
      default:
        return "bg-gradient-to-r from-therapy-500 via-harmony-500 to-flow-500 text-white hover:from-therapy-600 hover:via-harmony-600 hover:to-flow-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden";
    }
  };

  if (variant === 'outline' || variant === 'ghost') {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn(getGradientClasses(variant), className)}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      size={size}
      className={cn(
        getGradientClasses(variant),
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
