import React from 'react';
import blogInsightsIcon from '@/assets/icons/blog-insights.svg';

interface BlogInsightsProps {
  className?: string;
  size?: number;
}

const BlogInsights: React.FC<BlogInsightsProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={blogInsightsIcon} 
      alt="Blog & Insights" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default BlogInsights;