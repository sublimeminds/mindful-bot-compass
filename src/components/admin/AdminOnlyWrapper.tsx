
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/utils/adminUtils';

interface AdminOnlyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdminOnlyWrapper: React.FC<AdminOnlyWrapperProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth();
  
  if (!isAdminUser(user)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default AdminOnlyWrapper;
