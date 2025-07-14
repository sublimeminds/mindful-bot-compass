import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useEmailPinAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pinSent, setPinSent] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const { user } = useAuth();

  const sendEmailPin = useCallback(async (email?: string) => {
    if (!user && !email) {
      throw new Error('User must be authenticated or email must be provided');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email-pin', {
        body: {
          email: email || user?.email,
          user_id: user?.id
        }
      });

      if (error) throw error;

      setPinSent(true);
      setExpiresAt(data.expires_at);
      toast.success('Security PIN sent to your email');
      
      return { success: true, expires_at: data.expires_at };
    } catch (error: any) {
      console.error('Failed to send email PIN:', error);
      toast.error('Failed to send PIN: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const verifyEmailPin = useCallback(async (pin: string, email?: string) => {
    if (!user && !email) {
      throw new Error('User must be authenticated or email must be provided');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-email-pin', {
        body: {
          email: email || user?.email,
          pin,
          user_id: user?.id
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('PIN verified successfully');
        setPinSent(false);
        setExpiresAt(null);
        return { success: true };
      } else {
        toast.error(data.error);
        return { 
          success: false, 
          error: data.error,
          remaining_attempts: data.remaining_attempts 
        };
      }
    } catch (error: any) {
      console.error('Failed to verify PIN:', error);
      toast.error('Failed to verify PIN: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const resetPin = useCallback(() => {
    setPinSent(false);
    setExpiresAt(null);
  }, []);

  return {
    sendEmailPin,
    verifyEmailPin,
    resetPin,
    isLoading,
    pinSent,
    expiresAt
  };
};