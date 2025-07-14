import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DeviceInfo {
  id: string;
  user_id: string;
  device_fingerprint: string;
  device_name: string;
  device_type: string;
  os: string;
  browser: string;
  ip_address: unknown;
  location_data: any;
  is_trusted: boolean;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

interface SessionInfo {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: unknown;
  user_agent: string;
  created_at: string;
  last_activity: string;
  terminated_at: string;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  confidence_score: number;
  evidence: any;
  triggered_at: string;
  is_resolved: boolean;
}

interface SharingAnalysis {
  confidence_score: number;
  indicators: string[];
  active_sessions: number;
  unique_locations: number;
  requires_action: boolean;
}

export const useSecurityMonitor = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Generate device fingerprint
  const generateDeviceFingerprint = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    
    const fingerprint = btoa(
      navigator.userAgent +
      navigator.language +
      screen.width + 'x' + screen.height +
      new Date().getTimezoneOffset() +
      (canvas.toDataURL() || 'no-canvas')
    ).slice(0, 32);
    
    return fingerprint;
  }, []);

  // Register current device
  const registerDevice = useCallback(async () => {
    if (!user) return null;

    try {
      const fingerprint = generateDeviceFingerprint();
      const deviceInfo = {
        type: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 
              (/iPad|Tablet/i.test(navigator.userAgent) ? 'tablet' : 'mobile') : 'desktop',
        os: /Windows/i.test(navigator.userAgent) ? 'Windows' :
            /Mac OS/i.test(navigator.userAgent) ? 'macOS' :
            /Linux/i.test(navigator.userAgent) ? 'Linux' :
            /Android/i.test(navigator.userAgent) ? 'Android' :
            /iOS|iPhone|iPad/i.test(navigator.userAgent) ? 'iOS' : 'Unknown',
        browser: /Chrome/i.test(navigator.userAgent) ? 'Chrome' :
                /Firefox/i.test(navigator.userAgent) ? 'Firefox' :
                /Safari/i.test(navigator.userAgent) ? 'Safari' :
                /Edge/i.test(navigator.userAgent) ? 'Edge' : 'Unknown'
      };

      const { data, error } = await supabase.functions.invoke('security-monitor', {
        body: {
          user_id: user.id,
          action: 'register_device',
          device_fingerprint: fingerprint,
          device_info: deviceInfo
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to register device:', error);
      return null;
    }
  }, [user, generateDeviceFingerprint]);

  // Track session activity
  const trackSession = useCallback(async (sessionId: string) => {
    if (!user) return;

    try {
      await supabase.functions.invoke('security-monitor', {
        body: {
          user_id: user.id,
          action: 'track_session',
          session_id: sessionId
        }
      });
    } catch (error) {
      console.error('Failed to track session:', error);
    }
  }, [user]);

  // Detect account sharing
  const detectSharing = useCallback(async (): Promise<SharingAnalysis | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('security-monitor', {
        body: {
          user_id: user.id,
          action: 'detect_sharing'
        }
      });

      if (error) throw error;
      return data.sharing_analysis;
    } catch (error) {
      console.error('Failed to detect sharing:', error);
      return null;
    }
  }, [user]);

  // Load user devices
  const loadDevices = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load user sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .is('terminated_at', null)
        .order('last_activity', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load security alerts
  const loadAlerts = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('account_sharing_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_resolved', false)
        .order('triggered_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Trust a device
  const trustDevice = useCallback(async (deviceId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_devices')
        .update({ is_trusted: true })
        .eq('id', deviceId)
        .eq('user_id', user.id);

      if (error) throw error;
      await loadDevices();
    } catch (error) {
      console.error('Failed to trust device:', error);
    }
  }, [user, loadDevices]);

  // Revoke device access
  const revokeDevice = useCallback(async (deviceId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_devices')
        .delete()
        .eq('id', deviceId)
        .eq('user_id', user.id);

      if (error) throw error;
      await loadDevices();
    } catch (error) {
      console.error('Failed to revoke device:', error);
    }
  }, [user, loadDevices]);

  // Terminate session
  const terminateSession = useCallback(async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          terminated_at: new Date().toISOString()
        })
        .eq('session_token', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;
      // Reload sessions after termination
      loadSessions();
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  }, [user, loadSessions]);

  // Initialize security monitoring
  useEffect(() => {
    if (user) {
      registerDevice();
      loadDevices();
      loadSessions();
      loadAlerts();
    }
  }, [user]);

  return {
    devices,
    sessions,
    alerts,
    isLoading,
    registerDevice,
    trackSession,
    detectSharing,
    loadDevices,
    loadSessions,
    loadAlerts,
    trustDevice,
    revokeDevice,
    terminateSession
  };
};