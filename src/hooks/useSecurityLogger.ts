
import { useCallback } from 'react';
import { SecurityEvent, SecurityEventDetails } from '@/types/auth';

export const useSecurityLogger = (user: any) => {
  const logSecurityEvent = useCallback(async (
    eventType: string, 
    severity: 'low' | 'medium' | 'high' | 'critical', 
    details: SecurityEventDetails
  ) => {
    try {
      const projectId = 'dbwrbjjmraodegffupnx';
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/security-monitor/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3JiamptcmFvZGVnZmZ1cG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjcwNTksImV4cCI6MjA2NTA0MzA1OX0.cY8oKDsNDOzYj7GsWFjFvFoze47lZQe9JM9khJMc6G4`
        },
        body: JSON.stringify({
          event_type: eventType,
          severity,
          details,
          user_id: user?.id
        })
      });

      if (!response.ok) {
        console.warn('Failed to log security event:', response.statusText);
      }
    } catch (error) {
      console.warn('Security event logging failed:', error);
    }
  }, [user?.id]);

  return { logSecurityEvent };
};
