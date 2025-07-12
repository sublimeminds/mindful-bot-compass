import React from 'react';
import FamilyAccessGate from '@/components/family/FamilyAccessGate';
import FamilyFeaturesLanding from '@/components/family/FamilyFeaturesLanding';

const FamilyFeaturesPage = () => {
  return (
    <FamilyAccessGate>
      <FamilyFeaturesLanding />
    </FamilyAccessGate>
  );
};

export default FamilyFeaturesPage;