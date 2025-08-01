import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AppleStyleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const AppleStyleButton: React.FC<AppleStyleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  onClick,
  disabled = false,
}) => {
  const baseClasses = "font-medium transition-all duration-500 relative overflow-hidden group";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white shadow-xl hover:shadow-2xl",
    secondary: "bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-therapy-400 shadow-lg hover:shadow-xl border-2 border-slate-300",
    outline: "border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
  };
  
  const sizeClasses = {
    sm: "px-6 py-3 text-sm rounded-xl",
    md: "px-8 py-4 text-base rounded-xl", 
    lg: "px-10 py-7 text-lg rounded-2xl"
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        <span className="relative z-10 flex items-center">
          {Icon && <Icon className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />}
          {children}
        </span>
        {/* Shimmer effect for primary variant */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
      </Button>
    </motion.div>
  );
};

export default AppleStyleButton;