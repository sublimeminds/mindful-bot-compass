import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthActionsResult {
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ error: Error | null }>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

// Bulletproof auth actions with comprehensive error handling
export const useBulletproofAuthActions = (): AuthActionsResult => {
  
  const validateInputs = (email: string, password: string): string | null => {
    if (!email || !email.trim()) {
      return 'Email is required';
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      return 'Please enter a valid email address';
    }
    
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    return null;
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('BulletproofAuth: Starting signup process');
      
      // Validate inputs
      const validationError = validateInputs(email, password);
      if (validationError) {
        return { error: new Error(validationError) };
      }

      // Validate Supabase client
      if (!supabase || typeof supabase.auth?.signUp !== 'function') {
        return { error: new Error('Authentication service not available') };
      }

      // Get current origin for redirect
      const redirectTo = typeof window !== 'undefined' 
        ? `${window.location.origin}/dashboard`
        : '/dashboard';

      const { error } = await supabase.auth.signUp({ 
        email: email.trim().toLowerCase(), 
        password,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        console.error('BulletproofAuth: Signup error:', error);
        
        // Handle specific Supabase errors
        if (error.message.includes('already registered')) {
          return { error: new Error('This email is already registered. Please try signing in instead.') };
        }
        
        if (error.message.includes('invalid email')) {
          return { error: new Error('Please enter a valid email address.') };
        }
        
        if (error.message.includes('weak password')) {
          return { error: new Error('Password is too weak. Please choose a stronger password.') };
        }
        
        return { error: new Error(error.message || 'Signup failed. Please try again.') };
      }

      console.log('BulletproofAuth: Signup successful');
      return { error: null };

    } catch (error) {
      console.error('BulletproofAuth: Signup exception:', error);
      return { 
        error: new Error(
          error instanceof Error 
            ? error.message 
            : 'Signup failed due to unexpected error'
        ) 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('BulletproofAuth: Starting signin process');
      
      // Validate inputs
      const validationError = validateInputs(email, password);
      if (validationError) {
        return { error: new Error(validationError) };
      }

      // Validate Supabase client
      if (!supabase || typeof supabase.auth?.signInWithPassword !== 'function') {
        return { error: new Error('Authentication service not available') };
      }

      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      });

      if (error) {
        console.error('BulletproofAuth: Signin error:', error);
        
        // Handle specific Supabase errors
        if (error.message.includes('Invalid login credentials')) {
          return { error: new Error('Invalid email or password. Please check your credentials and try again.') };
        }
        
        if (error.message.includes('Email not confirmed')) {
          return { error: new Error('Please check your email and confirm your account before signing in.') };
        }
        
        if (error.message.includes('Too many requests')) {
          return { error: new Error('Too many login attempts. Please wait a moment and try again.') };
        }
        
        return { error: new Error(error.message || 'Sign in failed. Please try again.') };
      }

      console.log('BulletproofAuth: Signin successful');
      return { error: null };

    } catch (error) {
      console.error('BulletproofAuth: Signin exception:', error);
      return { 
        error: new Error(
          error instanceof Error 
            ? error.message 
            : 'Sign in failed due to unexpected error'
        ) 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('BulletproofAuth: Starting signout process');
      
      // Validate Supabase client
      if (!supabase || typeof supabase.auth?.signOut !== 'function') {
        console.warn('BulletproofAuth: Supabase client not available for signout');
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('BulletproofAuth: Signout error:', error);
        // Continue anyway - signout should not fail silently
      } else {
        console.log('BulletproofAuth: Signout successful');
      }

      // Clear any local storage items related to auth
      try {
        localStorage.removeItem('auth_debug');
      } catch (e) {
        console.warn('BulletproofAuth: Could not clear local storage');
      }

    } catch (error) {
      console.error('BulletproofAuth: Signout exception:', error);
      // Don't throw - signout should be resilient
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    // Aliases for compatibility
    register: signUp,
    login: signIn,
    logout: signOut,
  };
};