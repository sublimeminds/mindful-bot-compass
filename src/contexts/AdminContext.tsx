
import * as React from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  adminRole: string | null;
  userRoles: string[];
  hasPermission: (permission: string, resource: string) => boolean;
  isLoading: boolean;
}

const AdminContext = React.createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // For now, just provide basic admin context
  // In a real app, you'd check user roles from the database
  const isAdmin = false; // Simplified for now
  const adminRole = null;
  const userRoles: string[] = [];
  const isLoading = false;

  const hasPermission = (permission: string, resource: string) => {
    // Simplified implementation - always return false for now
    return false;
  };

  const value = {
    isAdmin,
    adminRole,
    userRoles,
    hasPermission,
    isLoading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = React.useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
