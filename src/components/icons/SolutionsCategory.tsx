import React from 'react';
import solutionsCategoryImage from '@/assets/solutions-category.png';

interface SolutionsCategoryProps {
  className?: string;
  size?: number;
}

const SolutionsCategory: React.FC<SolutionsCategoryProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={solutionsCategoryImage} 
      alt="Solutions Category" 
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default SolutionsCategory;