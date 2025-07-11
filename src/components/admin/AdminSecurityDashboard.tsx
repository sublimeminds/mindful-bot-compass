
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Eye, Lock, Activity, Users, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  ip_address?: string;
  user_id?: string;
  resolved: boolean;
}

const AdminSecurityDashboard = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { tickets } = useSupportTickets(true);

  const loadSecurityEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load real security events from audit logs
      const { data: auditLogs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform audit logs to security events
      const events: SecurityEvent[] = auditLogs?.map(log => ({
        id: log.id,
        type: log.action,
        severity: log.action.includes('delete') ? 'high' : 'medium',
        timestamp: log.created_at,
        description: `${log.action} on ${log.resource}`,
        ip_address: log.ip_address?.toString(),
        user_id: log.user_id,
        resolved: false
      })) || [];

      setSecurityEvents(events);
    } catch (error) {
      console.error('Error loading security events:', error);
      toast({
        title: "Error",
        description: "Failed to load security events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSecurityEvents();
  }, [loadSecurityEvents]);

  const resolveEvent = (eventId: string) => {
    setSecurityEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, resolved: true } : event
      )
    );
    toast({
      title: "Event Resolved",
      description: `Security event ${eventId} has been marked as resolved.`,
    });
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Shield className="h-5 w-5 mr-2 text-blue-400" />
          Security Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading security events...</div>
        ) : securityEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No security events to display.</div>
        ) : (
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${severityColor(event.severity)}`}>
                    {getSeverityIcon(event.severity)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{event.type}</h3>
                    <p className="text-sm text-gray-400">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.ip_address && (
                      <p className="text-xs text-gray-500">IP: {event.ip_address}</p>
                    )}
                  </div>
                </div>
                <div>
                  {!event.resolved ? (
                    <Button variant="outline" size="sm" onClick={() => resolveEvent(event.id)}>
                      Resolve
                    </Button>
                  ) : (
                    <Badge variant="secondary">Resolved</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSecurityDashboard;
