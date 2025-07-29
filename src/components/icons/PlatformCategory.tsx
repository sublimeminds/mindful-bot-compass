import React from 'react';
import platformCategoryImage from '@/assets/platform-category.png';

interface PlatformCategoryProps {
  className?: string;
  size?: number;
}

const PlatformCategory: React.FC<PlatformCategoryProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={platformCategoryImage} 
      alt="Platform Category" 
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default PlatformCategory;