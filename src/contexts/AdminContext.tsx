
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  adminRole: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // For now, just provide basic admin context
  // In a real app, you'd check user roles from the database
  const isAdmin = false; // Simplified for now
  const adminRole = null;

  const value = {
    isAdmin,
    adminRole
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
