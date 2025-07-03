import { createContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Single shared AuthContext used throughout the app
export const AuthContext = createContext<AuthContextType | undefined>(undefined);