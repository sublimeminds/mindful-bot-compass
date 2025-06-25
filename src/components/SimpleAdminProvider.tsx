
import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminContextType } from '@/types/contexts';

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: React.ReactNode;
}

export const SimpleAdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState<AdminContextType>({
    isAdmin: false,
    adminRole: null,
    permissions: [],
    hasPermission: () => false
  });

  useEffect(() => {
    if (user) {
      // Enhanced admin check with multiple criteria
      const isAdmin = 
        user.email?.includes('admin') || 
        user.email === 'owner@therapysync.com' ||
        user.email === 'administrator@therapysync.com' ||
        user.email === 'root@therapysync.com';

      // Define admin role based on email
      let adminRole = null;
      let permissions: string[] = [];

      if (isAdmin) {
        if (user.email === 'owner@therapysync.com' || user.email === 'root@therapysync.com') {
          adminRole = 'owner';
          permissions = [
            'read_all', 'write_all', 'delete_all', 'manage_users', 
            'manage_infrastructure', 'manage_billing', 'manage_security',
            'manage_ai', 'manage_content', 'manage_integrations',
            'view_analytics', 'manage_crisis', 'system_admin'
          ];
        } else if (user.email?.includes('admin')) {
          adminRole = 'admin';
          permissions = [
            'read_all', 'write_most', 'manage_users', 'manage_content',
            'view_analytics', 'manage_ai', 'manage_integrations',
            'manage_crisis'
          ];
        }
      }

      const hasPermission = (permission: string) => {
        return permissions.includes(permission) || permissions.includes('read_all');
      };

      setAdminData({
        isAdmin,
        adminRole,
        permissions,
        hasPermission
      });

      // Log admin access for security auditing
      if (isAdmin) {
        console.log(`Admin access granted: ${user.email} (${adminRole})`);
      }
    } else {
      setAdminData({
        isAdmin: false,
        adminRole: null,
        permissions: [],
        hasPermission: () => false
      });
    }
  }, [user]);

  return (
    <AdminContext.Provider value={adminData}>
      {children}
    </AdminContext.Provider>
  );
};
