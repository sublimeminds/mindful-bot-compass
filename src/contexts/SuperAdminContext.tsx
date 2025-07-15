import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SuperAdmin {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  sessionToken: string;
}

interface SuperAdminContextType {
  admin: SuperAdmin | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  secureUrlPrefix: string | null;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export const SuperAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<SuperAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [secureUrlPrefix, setSecureUrlPrefix] = useState<string | null>(null);

  useEffect(() => {
    // Load secure URL prefix and check for existing session
    const initializeAdmin = async () => {
      try {
        // Get secure URL prefix from database
        const { data: configData } = await supabase
          .from('admin_configuration')
          .select('config_value')
          .eq('config_key', 'secure_admin_url_prefix')
          .single();

        if (configData?.config_value) {
          setSecureUrlPrefix(String(configData.config_value));
        }

        // Check for existing admin session
        const sessionToken = localStorage.getItem('super_admin_session');
        if (sessionToken) {
          await validateSession(sessionToken);
        }
      } catch (error) {
        console.error('Failed to initialize super admin:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAdmin();
  }, []);

  const validateSession = async (sessionToken: string) => {
    try {
      const { data: sessionData } = await supabase
        .from('admin_sessions')
        .select(`
          admin_id,
          super_admins!inner(
            id,
            username,
            email,
            role
          )
        `)
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (sessionData) {
        // Get admin permissions
        const { data: permissionsData } = await supabase
          .from('admin_role_permissions')
          .select('permission')
          .eq('role', sessionData.super_admins.role)
          .eq('granted', true);

        const permissions = permissionsData?.map(p => p.permission) || [];

        setAdmin({
          id: sessionData.super_admins.id,
          username: sessionData.super_admins.username,
          email: sessionData.super_admins.email,
          role: sessionData.super_admins.role,
          permissions,
          sessionToken
        });

        // Update session activity
        await supabase
          .from('admin_sessions')
          .update({ last_activity: new Date().toISOString() })
          .eq('session_token', sessionToken);
      } else {
        // Invalid session, clear it
        localStorage.removeItem('super_admin_session');
        setAdmin(null);
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      localStorage.removeItem('super_admin_session');
      setAdmin(null);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call edge function for admin authentication
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'login',
          username,
          password,
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent
        }
      });

      if (error) {
        return { success: false, error: 'Authentication failed' };
      }

      if (data.success) {
        const { sessionToken, admin: adminData, permissions } = data;
        
        // Store session token
        localStorage.setItem('super_admin_session', sessionToken);
        
        setAdmin({
          id: adminData.id,
          username: adminData.username,
          email: adminData.email,
          role: adminData.role,
          permissions,
          sessionToken
        });

        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const logout = async () => {
    try {
      if (admin?.sessionToken) {
        // Revoke session in database
        await supabase
          .from('admin_sessions')
          .update({ 
            is_active: false, 
            revoked_at: new Date().toISOString(),
            revoked_reason: 'user_logout'
          })
          .eq('session_token', admin.sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('super_admin_session');
      setAdmin(null);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return admin?.permissions.includes(permission) || false;
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const value: SuperAdminContextType = {
    admin,
    loading,
    login,
    logout,
    hasPermission,
    secureUrlPrefix
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
};