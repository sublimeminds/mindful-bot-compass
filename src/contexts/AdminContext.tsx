
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';

interface AdminContextType {
  isAdmin: boolean;
  adminData: any;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Mock admin context for now
  const adminData = {
    isAdmin: user?.email === 'admin@therapysync.com' || false,
    adminData: null
  };

  return (
    <AdminContext.Provider value={adminData}>
      {children}
    </AdminContext.Provider>
  );
};
