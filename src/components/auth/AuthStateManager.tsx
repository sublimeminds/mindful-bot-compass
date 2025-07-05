
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Detect if we're in Electron
    const electronCheck = window.navigator.userAgent.toLowerCase().includes('electron') ||
                         typeof window.electronAPI !== 'undefined' ||
                         window.location.protocol === 'file:';
    
    setIsElectron(electronCheck);
    console.log('AuthStateManager: Electron detected:', electronCheck);

    const initializeAuth = async () => {
      try {
        console.log('AuthStateManager: Starting auth initialization');
        
        // Set a timeout for Electron to prevent infinite loading
        const authTimeout = setTimeout(() => {
          console.warn('AuthStateManager: Auth initialization timed out, continuing with offline mode');
          setUser(null);
          setLoading(false);
        }, electronCheck ? 5000 : 10000); // 5 seconds for Electron, 10 for web

        // Try to get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Clear timeout since we got a response
        clearTimeout(authTimeout);
        
        if (error) {
          console.error('AuthStateManager: Session error:', error);
          if (electronCheck) {
            console.log('AuthStateManager: Continuing in offline mode due to session error');
            setUser(null);
            setLoading(false);
            return;
          }
        }

        console.log('AuthStateManager: Session retrieved:', session ? 'User logged in' : 'No session');
        setUser(session?.user ?? null);
        setLoading(false);

      } catch (error) {
        console.error('AuthStateManager: Initialization error:', error);
        // In Electron, don't block the app if auth fails
        if (electronCheck) {
          console.log('AuthStateManager: Auth failed in Electron, continuing in offline mode');
        }
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        try {
          console.log('AuthStateManager: Auth state changed:', event, session ? 'User present' : 'No user');
          setUser(session?.user ?? null);
          setLoading(false);
        } catch (error) {
          console.error('AuthStateManager: Auth state change error:', error);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('AuthStateManager: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, setUser };
};
