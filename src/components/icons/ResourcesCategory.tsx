import React from 'react';
import resourcesCategoryImage from '@/assets/resources-category.png';

interface ResourcesCategoryProps {
  className?: string;
  size?: number;
}

const ResourcesCategory: React.FC<ResourcesCategoryProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={resourcesCategoryImage} 
      alt="Resources Category" 
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default ResourcesCategory;