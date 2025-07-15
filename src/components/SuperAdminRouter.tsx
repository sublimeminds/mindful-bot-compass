import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { supabase } from '@/integrations/supabase/client';

// Super Admin Pages
import SuperAdminLogin from '@/pages/SuperAdminLogin';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';

// True Admin Components (to be created)
import SuperAdminUsers from '@/pages/super-admin/SuperAdminUsers';
import SuperAdminAI from '@/pages/super-admin/SuperAdminAI';
import SuperAdminContent from '@/pages/super-admin/SuperAdminContent';
import SuperAdminTranslations from '@/pages/super-admin/SuperAdminTranslations';
import SuperAdminAnalytics from '@/pages/super-admin/SuperAdminAnalytics';
import SuperAdminCrisis from '@/pages/super-admin/SuperAdminCrisis';
import SuperAdminSystem from '@/pages/super-admin/SuperAdminSystem';
import SuperAdminSecurity from '@/pages/super-admin/SuperAdminSecurity';

const SuperAdminRouter = () => {
  const { admin, secureUrlPrefix, loading } = useSuperAdmin();
  const location = useLocation();
  const [validPrefix, setValidPrefix] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrlPrefix = async () => {
      try {
        const { data } = await supabase
          .from('admin_configuration')
          .select('config_value')
          .eq('config_key', 'secure_admin_url_prefix')
          .single();

        if (data?.config_value) {
          setValidPrefix(String(data.config_value).replace(/"/g, ''));
        }
      } catch (error) {
        console.error('Failed to fetch admin URL prefix:', error);
      }
    };

    fetchUrlPrefix();
  }, []);

  if (loading || !validPrefix) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if current path matches the secure admin prefix
  const isSecureAdminPath = location.pathname.startsWith(`/${validPrefix}`);
  
  if (!isSecureAdminPath) {
    return null; // This router only handles secure admin paths
  }

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!admin) {
      return <Navigate to={`/${validPrefix}/login`} replace />;
    }
    return <>{children}</>;
  };

  // Permission-based route wrapper
  const PermissionRoute = ({ 
    children, 
    permission, 
    fallback 
  }: { 
    children: React.ReactNode; 
    permission: string;
    fallback?: React.ReactNode;
  }) => {
    if (!admin) {
      return <Navigate to={`/${validPrefix}/login`} replace />;
    }
    
    if (!admin.permissions.includes(permission)) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
            <p className="text-slate-400">You don't have permission to access this area.</p>
          </div>
        </div>
      );
    }
    
    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Login route - only accessible when not logged in */}
      <Route 
        path={`/${validPrefix}/login`} 
        element={
          admin ? (
            <Navigate to={`/${validPrefix}`} replace />
          ) : (
            <SuperAdminLogin />
          )
        } 
      />

      {/* Protected super admin routes */}
      <Route 
        path={`/${validPrefix}`} 
        element={
          <ProtectedRoute>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* User Management */}
      <Route 
        path={`/${validPrefix}/users`} 
        element={
          <PermissionRoute permission="user_management">
            <SuperAdminUsers />
          </PermissionRoute>
        } 
      />

      {/* AI Management */}
      <Route 
        path={`/${validPrefix}/ai`} 
        element={
          <PermissionRoute permission="ai_management">
            <SuperAdminAI />
          </PermissionRoute>
        } 
      />

      {/* Content Management */}
      <Route 
        path={`/${validPrefix}/content`} 
        element={
          <PermissionRoute permission="content_management">
            <SuperAdminContent />
          </PermissionRoute>
        } 
      />

      {/* Translation Management */}
      <Route 
        path={`/${validPrefix}/translations`} 
        element={
          <PermissionRoute permission="translation_management">
            <SuperAdminTranslations />
          </PermissionRoute>
        } 
      />

      {/* Platform Analytics */}
      <Route 
        path={`/${validPrefix}/analytics`} 
        element={
          <PermissionRoute permission="platform_analytics">
            <SuperAdminAnalytics />
          </PermissionRoute>
        } 
      />

      {/* Crisis Management */}
      <Route 
        path={`/${validPrefix}/crisis`} 
        element={
          <PermissionRoute permission="crisis_management">
            <SuperAdminCrisis />
          </PermissionRoute>
        } 
      />

      {/* System Configuration */}
      <Route 
        path={`/${validPrefix}/system`} 
        element={
          <PermissionRoute permission="system_config">
            <SuperAdminSystem />
          </PermissionRoute>
        } 
      />

      {/* Security & Audit */}
      <Route 
        path={`/${validPrefix}/security`} 
        element={
          <PermissionRoute permission="security_management">
            <SuperAdminSecurity />
          </PermissionRoute>
        } 
      />

      {/* Catch all - redirect to dashboard */}
      <Route 
        path={`/${validPrefix}/*`} 
        element={
          <ProtectedRoute>
            <Navigate to={`/${validPrefix}`} replace />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default SuperAdminRouter;