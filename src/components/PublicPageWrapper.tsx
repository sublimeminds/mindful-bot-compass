
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';

interface PublicPageWrapperProps {
  children: React.ReactNode;
}

const PublicPageWrapper: React.FC<PublicPageWrapperProps> = ({ children }) => {
  console.log('🔍 PublicPageWrapper: Wrapping public page with PageLayout');
  
  return (
    <PageLayout>
      {children}
    </PageLayout>
  );
};

export default PublicPageWrapper;
