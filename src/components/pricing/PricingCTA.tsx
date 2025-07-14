
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
    // Store plan selection in localStorage for later use
    const planSelection = {
      name: planName,
      price: planPrice,
      data: planData,
      selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(planSelection));
    
    // Implement proper user flow: check auth -> sign up -> billing -> onboarding
    if (!user) {
      // Not authenticated - go to sign up with plan selection
      navigate('/auth?redirect=billing&plan=' + encodeURIComponent(planName));
    } else {
      // Authenticated - go to billing if paid plan, otherwise onboarding
      if (planPrice && planPrice > 0) {
        navigate('/billing');
      } else {
        navigate('/onboarding');
      }
    }
  };

  return (
    <Button onClick={handleClick} className={className}>
      {children}
    </Button>
  );
};

export default PricingCTA;
