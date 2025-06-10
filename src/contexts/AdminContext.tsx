
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAdmin: boolean;
  userRoles: string[];
  hasPermission: (permission: string, resource: string) => boolean;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user || !isAuthenticated) {
        setIsAdmin(false);
        setUserRoles([]);
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has admin roles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          setIsLoading(false);
          return;
        }

        const rolesList = roles?.map(r => r.role) || [];
        setUserRoles(rolesList);

        const adminRoles = ['super_admin', 'content_admin', 'support_admin', 'analytics_admin'];
        const hasAdminRole = rolesList.some(role => adminRoles.includes(role));
        setIsAdmin(hasAdminRole);

        // Fetch permissions for admin users
        if (hasAdminRole) {
          const { data: perms, error: permsError } = await supabase
            .from('admin_permissions')
            .select('*')
            .in('role', rolesList);

          if (!permsError) {
            setPermissions(perms || []);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }

      setIsLoading(false);
    };

    checkAdminStatus();
  }, [user, isAuthenticated]);

  const hasPermission = (permission: string, resource: string) => {
    if (!isAdmin) return false;
    if (userRoles.includes('super_admin')) return true;

    return permissions.some(perm => 
      perm.permission_name === permission && 
      perm.resource_type === resource && 
      perm.can_read === true
    );
  };

  const value = {
    isAdmin,
    userRoles,
    hasPermission,
    isLoading,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
