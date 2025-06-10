
import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PerformanceNavigationLink = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => navigate('/admin/performance')}
      className="flex items-center space-x-2"
    >
      <Activity className="h-4 w-4" />
      <span>Performance</span>
    </Button>
  );
};

export default PerformanceNavigationLink;
