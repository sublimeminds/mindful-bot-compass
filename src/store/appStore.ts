import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  isInitialized: boolean;
  theme: 'light' | 'dark';
  error: string | null;
  
  // Actions
  setInitialized: (initialized: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      isInitialized: false,
      theme: 'light',
      error: null,
      
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setTheme: (theme) => set({ theme }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-store',
    }
  )
);