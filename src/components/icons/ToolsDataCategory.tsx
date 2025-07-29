import React from 'react';
import toolsDataCategoryImage from '@/assets/tools-data-category.png';

interface ToolsDataCategoryProps {
  className?: string;
  size?: number;
}

const ToolsDataCategory: React.FC<ToolsDataCategoryProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={toolsDataCategoryImage} 
      alt="Tools & Data Category" 
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default ToolsDataCategory;