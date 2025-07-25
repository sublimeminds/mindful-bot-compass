import React from 'react';
import communityGroupsIcon from '@/assets/icons/community-groups.svg';

interface CommunityGroupsProps {
  className?: string;
  size?: number;
}

const CommunityGroups: React.FC<CommunityGroupsProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={communityGroupsIcon} 
      alt="Community & Groups" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default CommunityGroups;