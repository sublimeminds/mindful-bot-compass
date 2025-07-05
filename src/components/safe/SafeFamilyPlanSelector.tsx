import React, { Suspense } from 'react';

interface SafeFamilyPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

// Lazy load the actual component to prevent early initialization
const LazyFamilyPlanSelector = React.lazy(() => 
  import('@/components/family/FamilyPlanSelector').catch(() => ({
    default: () => null // Fallback component if import fails
  }))
);

const SafeFamilyPlanSelector = ({ isOpen, onClose, currentPlan }: SafeFamilyPlanSelectorProps) => {
  // Don't even load the component if not open
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <LazyFamilyPlanSelector
        isOpen={isOpen}
        onClose={onClose}
        currentPlan={currentPlan}
      />
    </Suspense>
  );
};

export default SafeFamilyPlanSelector;