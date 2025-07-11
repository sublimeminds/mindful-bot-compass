
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PricingCTAProps {
  planName: string;
  planPrice?: number;
  className?: string;
  children: React.ReactNode;
  planData?: any;
}

const PricingCTA: React.FC<PricingCTAProps> = ({ 
  planName, 
  planPrice, 
  className = "", 
  children,
  planData
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    // Store plan selection in localStorage for onboarding
    const planSelection = {
      name: planName,
      price: planPrice,
      data: planData,
      selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(planSelection));
    
    // Always go to onboarding regardless of auth status
    navigate('/onboarding');
  };

  return (
    <Button onClick={handleClick} className={className}>
      {children}
    </Button>
  );
};

export default PricingCTA;
