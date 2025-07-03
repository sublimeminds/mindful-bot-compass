
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthStateHook } from '@/types/auth';

export const useAuthState = (): AuthStateHook => {
  // CRITICAL: Start with loading: false to prevent blocking
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false - immediate render
  const [isElectron, setIsElectron] = useState(false);
  const [debugMode] = useState(() => localStorage.getItem('auth_debug') === 'true');

  useEffect(() => {
    // Detect if we're in Electron
    const electronCheck = window.navigator.userAgent.toLowerCase().includes('electron') ||
                         typeof window.electronAPI !== 'undefined' ||
                         window.location.protocol === 'file:';
    
    setIsElectron(electronCheck);
    console.log('AuthStateManager: Electron detected:', electronCheck);

    // Skip auth completely in debug mode
    if (debugMode) {
      console.log('AuthStateManager: Debug mode - skipping auth initialization');
      return;
    }

    // PHASE 1: Non-blocking background auth initialization
    const initializeAuthInBackground = () => {
      console.log('AuthStateManager: Starting background auth initialization');
      
      // Start auth state listener FIRST (before getSession)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          try {
            console.log('AuthStateManager: Auth state changed:', event, session ? 'User present' : 'No user');
            setUser(session?.user ?? null);
          } catch (error) {
            console.error('AuthStateManager: Auth state change error:', error);
          }
        }
      );

      // Then check for existing session (non-blocking)
      setTimeout(async () => {
        try {
          console.log('AuthStateManager: Checking for existing session');
          
          // Timeout protection
          const authTimeout = setTimeout(() => {
            console.warn('AuthStateManager: Session check timed out, continuing without auth');
          }, electronCheck ? 3000 : 5000);

          const { data: { session }, error } = await supabase.auth.getSession();
          clearTimeout(authTimeout);
          
          if (error) {
            console.error('AuthStateManager: Session error:', error);
            // Don't block - just log and continue
            return;
          }

          console.log('AuthStateManager: Session check complete:', session ? 'User logged in' : 'No session');
          setUser(session?.user ?? null);

        } catch (error) {
          console.error('AuthStateManager: Session check failed:', error);
          // App continues to work regardless
        }
      }, 100); // Small delay to ensure rendering starts first

      return subscription;
    };

    const subscription = initializeAuthInBackground();

    return () => {
      console.log('AuthStateManager: Cleaning up auth subscription');
      subscription?.unsubscribe();
    };
  }, [debugMode]);

  return { 
    user, 
    loading, 
    setUser,
    // Development helpers
    skipAuth: () => {
      console.log('AuthStateManager: Skipping auth for development');
      localStorage.setItem('auth_debug', 'true');
      window.location.reload();
    },
    enableAuth: () => {
      console.log('AuthStateManager: Re-enabling auth');
      localStorage.removeItem('auth_debug');
      window.location.reload();
    }
  };
};
