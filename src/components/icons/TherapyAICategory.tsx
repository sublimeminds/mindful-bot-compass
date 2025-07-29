import React from 'react';
import therapyAiCategoryImage from '@/assets/therapy-ai-category.png';

interface TherapyAICategoryProps {
  className?: string;
  size?: number;
}

const TherapyAICategory: React.FC<TherapyAICategoryProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={therapyAiCategoryImage} 
      alt="Therapy AI Category" 
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default TherapyAICategory;