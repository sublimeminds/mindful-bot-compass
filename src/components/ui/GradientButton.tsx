import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const GradientButtonComponent: React.FC<GradientButtonProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <Button
      className={`bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-primary-foreground font-semibold transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

const GradientButton: React.FC<GradientButtonProps> = (props) => (
  <SafeComponentWrapper name="GradientButton" fallback={<Button {...props} />}>
    <GradientButtonComponent {...props} />
  </SafeComponentWrapper>
);

export default GradientButton;