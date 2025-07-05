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
      className={`bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${className}`}
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