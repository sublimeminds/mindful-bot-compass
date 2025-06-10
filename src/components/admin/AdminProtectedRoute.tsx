
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    name: string;
    resource: string;
  };
}

const AdminProtectedRoute = ({ children, requiredPermission }: AdminProtectedRouteProps) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, hasPermission, isLoading: adminLoading } = useAdmin();

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission.name, requiredPermission.resource)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Insufficient Permissions</h1>
          <p className="text-gray-400">You don't have permission to access this section.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
