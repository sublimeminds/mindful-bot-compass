
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminLayoutEnhanced from '@/components/admin/AdminLayoutEnhanced';

const Admin = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <AdminLayoutEnhanced />;
};

export default Admin;
