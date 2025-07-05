
import React from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface AdminOnlyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdminOnlyWrapper: React.FC<AdminOnlyWrapperProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { user } = useSimpleApp();
  
  // Simple admin check - in a real app you'd check user roles
  const isAdmin = user?.email === 'admin@therapysync.com';
  
  if (!isAdmin) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default AdminOnlyWrapper;
