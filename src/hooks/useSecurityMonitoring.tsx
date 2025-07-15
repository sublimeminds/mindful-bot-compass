import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityIncident {
  id: string;
  incident_type: string;
  severity: string;
  description: string;
  detection_method: string;
  status: string;
  affected_users_count: number;
  detected_at: string;
  resolved_at?: string;
  metadata: any;
}

interface SecurityMetrics {
  totalIncidents: number;
  criticalIncidents: number;
  resolvedIncidents: number;
  averageResolutionTime: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const useSecurityMonitoring = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalIncidents: 0,
    criticalIncidents: 0,
    resolvedIncidents: 0,
    averageResolutionTime: 0,
    threatLevel: 'low'
  });

  const createSecurityAlert = useCallback(async (
    userId: string | null,
    alertType: string,
    severity: string,
    title: string,
    description: string,
    metadata?: any
  ) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .insert({
          user_id: userId,
          alert_type: alertType,
          severity,
          title,
          description,
          metadata: metadata || {},
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      // For critical alerts, also create an incident
      if (severity === 'critical') {
        await createSecurityIncident(alertType, severity, description, 'automated', metadata);
      }
    } catch (error: any) {
      console.error('Error creating security alert:', error);
    }
  }, []);

  const createSecurityIncident = useCallback(async (
    incidentType: string,
    severity: string,
    description: string,
    detectionMethod: string,
    metadata?: any
  ) => {
    try {
      const { error } = await supabase
        .from('security_incidents')
        .insert({
          incident_type: incidentType,
          severity,
          description,
          detection_method: detectionMethod,
          status: 'detected',
          affected_users_count: 0,
          metadata: metadata || {}
        });

      if (error) throw error;

      await fetchIncidents();
    } catch (error: any) {
      console.error('Error creating security incident:', error);
    }
  }, []);

  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setIncidents(data || []);
      
      // Calculate metrics
      const total = data?.length || 0;
      const critical = data?.filter(i => i.severity === 'critical').length || 0;
      const resolved = data?.filter(i => i.status === 'resolved').length || 0;
      
      const resolvedIncidents = data?.filter(i => i.resolved_at) || [];
      const avgResolution = resolvedIncidents.length > 0 
        ? resolvedIncidents.reduce((acc, incident) => {
            const detected = new Date(incident.detected_at).getTime();
            const resolved = new Date(incident.resolved_at!).getTime();
            return acc + (resolved - detected);
          }, 0) / resolvedIncidents.length / (1000 * 60 * 60) // Convert to hours
        : 0;

      const threatLevel = critical > 5 ? 'critical' 
        : critical > 2 ? 'high'
        : total > 10 ? 'medium' 
        : 'low';

      setMetrics({
        totalIncidents: total,
        criticalIncidents: critical,
        resolvedIncidents: resolved,
        averageResolutionTime: Math.round(avgResolution * 100) / 100,
        threatLevel
      });
    } catch (error: any) {
      console.error('Error fetching security incidents:', error);
      toast.error('Failed to fetch security incidents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resolveIncident = useCallback(async (incidentId: string, resolution: string) => {
    try {
      const { error } = await supabase
        .from('security_incidents')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          response_actions: { resolution }
        })
        .eq('id', incidentId);

      if (error) throw error;

      toast.success('Incident resolved successfully');
      await fetchIncidents();
    } catch (error: any) {
      console.error('Error resolving incident:', error);
      toast.error('Failed to resolve incident');
    }
  }, []);

  const detectSuspiciousActivity = useCallback(async (userId: string) => {
    try {
      // Check for multiple failed login attempts
      const { data: attempts, error } = await supabase
        .from('mfa_recovery_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('success', false)
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()); // Last 15 minutes

      if (error) throw error;

      if (attempts && attempts.length >= 5) {
        await createSecurityAlert(
          userId,
          'rate_limit_exceeded',
          'high',
          'Multiple Failed Authentication Attempts',
          `User has ${attempts.length} failed authentication attempts in the last 15 minutes`,
          { attemptCount: attempts.length, timeWindow: '15 minutes' }
        );
      }
    } catch (error: any) {
      console.error('Error detecting suspicious activity:', error);
    }
  }, [createSecurityAlert]);

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  // Real-time monitoring setup
  useEffect(() => {
    fetchIncidents();
    
    // Set up real-time subscription for new incidents
    const channel = supabase
      .channel('security-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_incidents'
        },
        (payload) => {
          setIncidents(prev => [payload.new as SecurityIncident, ...prev]);
          toast.error('New Security Incident Detected', {
            description: payload.new.description
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    isLoading,
    incidents,
    metrics,
    createSecurityAlert,
    createSecurityIncident,
    fetchIncidents,
    resolveIncident,
    detectSuspiciousActivity
  };
};