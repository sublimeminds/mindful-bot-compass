import React from 'react';
import pricingPlansIcon from '@/assets/icons/pricing-plans.svg';

interface PricingPlansProps {
  className?: string;
  size?: number;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={pricingPlansIcon} 
      alt="Pricing Plans" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default PricingPlans;