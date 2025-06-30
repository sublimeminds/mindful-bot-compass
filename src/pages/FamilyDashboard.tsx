
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FamilyDashboard from '@/components/family/FamilyDashboard';

const FamilyDashboardPage = () => {
  useSafeSEO({
    title: 'Family Dashboard - TherapySync',
    description: 'Manage your family\'s mental health journey together with our comprehensive family dashboard.',
    keywords: 'family therapy, family mental health, parental controls, child safety, family wellness'
  });

  return (
    <DashboardLayout>
      <FamilyDashboard />
    </DashboardLayout>
  );
};

export default FamilyDashboardPage;
