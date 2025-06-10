
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import PerformanceDashboard from './PerformanceDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const AdminPerformance = () => {
  const { user } = useAuth();

  // Simple admin check - in a real app this would be more sophisticated
  const isAdmin = user?.email === 'hi@fbeeg.io' || user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AdminLayout>
      <PerformanceDashboard />
    </AdminLayout>
  );
};

export default AdminPerformance;
