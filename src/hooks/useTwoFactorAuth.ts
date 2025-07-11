import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { TOTP } from 'otpauth';
import QRCode from 'qrcode';

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export const useTwoFactorAuth = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const setupTOTP = useCallback(async (): Promise<TwoFactorSetup | null> => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Generate TOTP secret
      const totp = new TOTP({
        issuer: 'TherapySync',
        label: user.email || user.id,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      });

      const secret = totp.secret.base32;
      
      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(totp.toString());
      
      // Generate backup codes
      const { data: backupCodes, error: backupError } = await supabase
        .rpc('generate_backup_codes');
      
      if (backupError) throw backupError;

      return {
        secret,
        qrCodeUrl,
        backupCodes: backupCodes || []
      };
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to setup two-factor authentication",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const confirmTOTP = useCallback(async (secret: string, code: string, backupCodes: string[]): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Insert 2FA record
      const { error } = await supabase
        .from('two_factor_auth')
        .insert({
          user_id: user.id,
          secret,
          backup_codes: backupCodes,
          is_enabled: true,
          setup_completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Two-Factor Authentication Enabled",
        description: "TOTP authentication has been successfully enabled for your account.",
      });
      
      return true;
    } catch (error) {
      console.error('Error confirming TOTP:', error);
      toast({
        title: "Confirmation Failed",
        description: "Failed to confirm two-factor authentication setup",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const setupSMS = useCallback(async (phoneNumber: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Generate verification code and store setup attempt
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const { error: setupError } = await supabase
        .from('two_factor_setup_attempts')
        .insert({
          user_id: user.id,
          method_type: 'sms',
          phone_number: phoneNumber,
          verification_code: verificationCode,
          expires_at: expiresAt.toISOString()
        });

      if (setupError) throw setupError;

      // Send SMS via Twilio edge function
      const { error: smsError } = await supabase.functions.invoke('twilio-sms', {
        body: {
          phone_number: phoneNumber,
          message: `Your TherapySync verification code is: ${verificationCode}. This code expires in 10 minutes.`,
          message_type: '2fa_setup'
        }
      });

      if (smsError) throw smsError;

      toast({
        title: "Verification Code Sent",
        description: `A verification code has been sent to ${phoneNumber}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error setting up SMS 2FA:', error);
      toast({
        title: "SMS Setup Failed",
        description: "Failed to send verification code",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const confirmSMS = useCallback(async (phoneNumber: string, code: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Verify the code
      const { data: setupAttempt, error: verifyError } = await supabase
        .from('two_factor_setup_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('method_type', 'sms')
        .eq('phone_number', phoneNumber)
        .eq('verification_code', code)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (verifyError || !setupAttempt) {
        throw new Error('Invalid or expired verification code');
      }

      // Generate backup codes
      const { data: backupCodes, error: backupError } = await supabase
        .rpc('generate_backup_codes');
      
      if (backupError) throw backupError;

      // Create 2FA record
      const { error: insertError } = await supabase
        .from('two_factor_auth')
        .insert({
          user_id: user.id,
          secret: 'sms_method',
          phone_number: phoneNumber,
          backup_codes: backupCodes,
          is_enabled: true,
          setup_completed_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Mark setup attempt as verified
      await supabase
        .from('two_factor_setup_attempts')
        .update({ is_verified: true })
        .eq('id', setupAttempt.id);

      toast({
        title: "SMS Two-Factor Authentication Enabled",
        description: "SMS authentication has been successfully enabled for your account.",
      });
      
      return true;
    } catch (error) {
      console.error('Error confirming SMS 2FA:', error);
      toast({
        title: "Verification Failed",
        description: "Invalid or expired verification code",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const disable2FA = useCallback(async (method: 'totp' | 'sms'): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('two_factor_auth')
        .update({ is_enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Two-Factor Authentication Disabled",
        description: `${method.toUpperCase()} authentication has been disabled for your account.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Failed to Disable 2FA",
        description: "Could not disable two-factor authentication",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const getTwoFactorStatus = useCallback(async () => {
    if (!user) return { totp: false, sms: false, phone_number: null };
    
    try {
      const { data, error } = await supabase
        .from('two_factor_auth')
        .select('phone_number, is_enabled')
        .eq('user_id', user.id)
        .eq('is_enabled', true);

      if (error) throw error;

      const status = { totp: false, sms: false, phone_number: null };
      
      data?.forEach(item => {
        if (item.phone_number) {
          status.sms = true;
          status.phone_number = item.phone_number;
        } else {
          status.totp = true;
        }
      });

      return status;
    } catch (error) {
      console.error('Error getting 2FA status:', error);
      return { totp: false, sms: false, phone_number: null };
    }
  }, [user]);

  return {
    loading,
    setupTOTP,
    confirmTOTP,
    setupSMS,
    confirmSMS,
    disable2FA,
    getTwoFactorStatus
  };
};