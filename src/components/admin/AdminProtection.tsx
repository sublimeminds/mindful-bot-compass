import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface AdminProtectionProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackComponent?: React.ReactNode;
}

const AdminProtection: React.FC<AdminProtectionProps> = ({ 
  children, 
  requiredPermission,
  fallbackComponent 
}) => {
  const { user, loading } = useAuth();
  const { isAdmin, hasPermission, adminRole } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin status
  if (!isAdmin) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <Lock className="h-5 w-5 mr-2" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-red-900/20 border-red-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                Administrator privileges required to access this area.
                <br />
                <br />
                Contact the system administrator if you believe this is an error.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-700 p-3 rounded-lg">
              <h4 className="text-white font-medium mb-2">Your Access Level:</h4>
              <p className="text-gray-300 text-sm">
                Email: {user.email}
                <br />
                Role: Standard User
                <br />
                Permissions: Limited
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-400">
              <Shield className="h-5 w-5 mr-2" />
              Insufficient Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-yellow-900/20 border-yellow-700">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                You don't have the required permission: <strong>{requiredPermission}</strong>
                <br />
                <br />
                Contact a system owner to request elevated access.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-700 p-3 rounded-lg">
              <h4 className="text-white font-medium mb-2">Your Admin Access:</h4>
              <p className="text-gray-300 text-sm">
                Email: {user.email}
                <br />
                Role: {adminRole}
                <br />
                Required: {requiredPermission}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Security audit log
  useEffect(() => {
    console.log(`Admin access verified: ${user.email} accessing ${requiredPermission || 'general admin area'}`);
  }, [user.email, requiredPermission]);

  return <>{children}</>;
};

export default AdminProtection;
