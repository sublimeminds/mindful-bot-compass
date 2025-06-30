
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import FamilyDashboard from '@/components/family/FamilyDashboard';

const FamilyDashboardPage = () => {
  useSafeSEO({
    title: 'Family Dashboard - TherapySync',
    description: 'Manage your family\'s mental health journey together with our comprehensive family dashboard.',
    keywords: 'family therapy, family mental health, parental controls, child safety, family wellness'
  });

  return (
    <DashboardLayoutWithSidebar>
      <FamilyDashboard />
    </DashboardLayoutWithSidebar>
  );
};

export default FamilyDashboardPage;
