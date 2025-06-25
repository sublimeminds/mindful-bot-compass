
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Lock, AlertTriangle, Eye, CheckCircle, XCircle, Clock, User, Key, Smartphone, Globe, Activity, Settings, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'therapist';
  isEmailVerified?: boolean;
}

const EnhancedAuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole, isEmailVerified }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTherapist, setIsTherapist] = useState(false);

  useEffect(() => {
    // Mock admin and therapist roles
    setIsAdmin(user?.email === 'admin@therapysync.com');
    setIsTherapist(user?.email === 'therapist@therapysync.com');
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <CardTitle className="text-lg font-medium">Loading...</CardTitle>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    toast({
      title: "Unauthorized",
      description: "You do not have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'therapist' && !isTherapist) {
    toast({
      title: "Unauthorized",
      description: "You do not have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  if (isEmailVerified === true && user.email_confirmed_at === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Email Verification Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Alert variant="destructive">
              <AlertDescription>
                Your email address is not verified. Please check your email to verify your account.
              </AlertDescription>
            </Alert>
            <p>
              Please verify your email to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnhancedAuthGuard;
