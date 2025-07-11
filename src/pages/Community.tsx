
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityHub from './CommunityHub';
import PageLayout from '@/components/layout/PageLayout';

const Community = () => {
  return (
    <PageLayout>
      <CommunityHub />
    </PageLayout>
  );
};

export default Community;
