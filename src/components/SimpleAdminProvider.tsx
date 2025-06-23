
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';

interface AdminContextType {
  isAdmin: boolean;
  adminRole: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const SimpleAdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // Simple admin check - in a real app, this would check user roles from the database
  const isAdmin = user?.email?.includes('admin') || false;
  const adminRole = isAdmin ? 'admin' : null;

  const value = {
    isAdmin,
    adminRole,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
