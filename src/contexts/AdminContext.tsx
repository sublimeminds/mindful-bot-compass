
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminRole: string | null;
  userRoles: string[];
  hasPermission: (permission: string, resource: string) => boolean;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole] = useState<string | null>(null);
  const [userRoles] = useState<string[]>([]);
  const [isLoading] = useState(false);

  const hasPermission = (permission: string, resource: string) => {
    // Simplified implementation - return false for now
    return false;
  };

  const value = {
    isAdmin,
    setIsAdmin,
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
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
