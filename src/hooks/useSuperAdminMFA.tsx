import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MFADevice {
  id: string;
  device_name: string;
  device_fingerprint: string;
  trust_token: string;
  last_used_at: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
  ip_address: unknown;
  user_agent: string;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  acknowledged: boolean;
  created_at: string;
  user_id: string;
  metadata: any;
  acknowledged_by: string;
  acknowledged_at: string;
  resolved: boolean;
  resolved_by: string;
  resolved_at: string;
  ip_address: unknown;
  user_agent: string;
}

export const useSuperAdminMFA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trustedDevices, setTrustedDevices] = useState<MFADevice[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);

  const setupEnhancedMFA = useCallback(async (adminId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('regenerate_backup_codes', {
        user_id_param: adminId
      });

      if (error) throw error;

      toast.success('Enhanced MFA configured successfully');
      return { success: true, backupCodes: data };
    } catch (error: any) {
      console.error('Enhanced MFA setup error:', error);
      toast.error('Failed to setup enhanced MFA: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyBackupCode = useCallback(async (adminId: string, code: string) => {
    try {
      const { data, error } = await supabase.rpc('verify_backup_code', {
        user_id_param: adminId,
        code_param: code
      });

      if (error) throw error;

      if (data) {
        toast.success('Backup code verified successfully');
        return { success: true };
      } else {
        toast.error('Invalid backup code');
        return { success: false, error: 'Invalid backup code' };
      }
    } catch (error: any) {
      console.error('Backup code verification error:', error);
      toast.error('Verification failed: ' + error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const createTrustedDevice = useCallback(async (
    adminId: string, 
    deviceName: string, 
    deviceFingerprint: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_trusted_device', {
        user_id_param: adminId,
        device_name_param: deviceName,
        device_fingerprint_param: deviceFingerprint,
        user_agent_param: navigator.userAgent
      });

      if (error) throw error;

      toast.success('Trusted device added successfully');
      await fetchTrustedDevices(adminId);
      return { success: true, trustToken: data };
    } catch (error: any) {
      console.error('Trusted device creation error:', error);
      toast.error('Failed to add trusted device: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTrustedDevices = useCallback(async (adminId: string) => {
    try {
      const { data, error } = await supabase
        .from('mfa_trusted_devices')
        .select('*')
        .eq('user_id', adminId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTrustedDevices(data || []);
    } catch (error: any) {
      console.error('Error fetching trusted devices:', error);
    }
  }, []);

  const revokeTrustedDevice = useCallback(async (deviceId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('mfa_trusted_devices')
        .update({ is_active: false })
        .eq('id', deviceId);

      if (error) throw error;

      toast.success('Trusted device revoked successfully');
      setTrustedDevices(prev => prev.filter(device => device.id !== deviceId));
    } catch (error: any) {
      console.error('Error revoking trusted device:', error);
      toast.error('Failed to revoke device: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSecurityAlerts = useCallback(async (adminId: string) => {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('user_id', adminId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setSecurityAlerts(data || []);
    } catch (error: any) {
      console.error('Error fetching security alerts:', error);
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({ 
          acknowledged: true, 
          acknowledged_by: adminId,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      setSecurityAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true }
            : alert
        )
      );

      toast.success('Alert acknowledged');
    } catch (error: any) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  }, []);

  return {
    isLoading,
    trustedDevices,
    securityAlerts,
    setupEnhancedMFA,
    verifyBackupCode,
    createTrustedDevice,
    fetchTrustedDevices,
    revokeTrustedDevice,
    fetchSecurityAlerts,
    acknowledgeAlert
  };
};