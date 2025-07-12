import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { liveAnalyticsService } from '@/services/liveAnalyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Shield, 
  Clock,
  CheckCircle,
  Users,
  Bell
} from 'lucide-react';

interface CrisisAlert {
  id: string;
  user_id: string;
  alert_type: string;
  severity_level: string;
  ai_confidence: number;
  trigger_data: any;
  created_at: string;
  resolved_at?: string;
  escalated_to?: string;
  resolution_status?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone_number?: string;
  email?: string;
  relationship?: string;
  contact_type: string;
  is_primary: boolean;
}

const CrisisNotificationSystem = () => {
  const { user } = useAuth();
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertSettings, setAlertSettings] = useState({
    autoEscalation: true,
    notifyContacts: true,
    professionalOverride: false
  });

  useEffect(() => {
    if (user) {
      loadCrisisData();
      subscribeToAlerts();
    }
  }, [user]);

  const loadCrisisData = async () => {
    if (!user) return;
    
    try {
      // Load recent crisis alerts
      const { data: alerts } = await supabase
        .from('crisis_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Load emergency contacts
      const { data: contacts } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      setCrisisAlerts(alerts || []);
      setEmergencyContacts(contacts || []);
    } catch (error) {
      console.error('Error loading crisis data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToAlerts = () => {
    if (!user) return;

    const channel = supabase
      .channel('crisis-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'crisis_alerts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newAlert = payload.new as CrisisAlert;
          setCrisisAlerts(prev => [newAlert, ...prev]);
          handleNewCrisisAlert(newAlert);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleNewCrisisAlert = async (alert: CrisisAlert) => {
    // Trigger immediate response based on severity
    if (alert.severity_level === 'high' && alertSettings.autoEscalation) {
      await escalateToEmergencyServices(alert);
    }
    
    if (alertSettings.notifyContacts) {
      await notifyEmergencyContacts(alert);
    }

    // Show browser notification if permissions granted
    if (Notification.permission === 'granted') {
      new Notification('Crisis Alert Detected', {
        body: `High-risk indicators detected. Immediate support resources activated.`,
        icon: '/favicon.ico'
      });
    }
  };

  const escalateToEmergencyServices = async (alert: CrisisAlert) => {
    try {
      // Call emergency escalation edge function
      await supabase.functions.invoke('emergency-escalation', {
        body: {
          alertId: alert.id,
          userId: alert.user_id,
          severity: alert.severity_level,
          triggerData: alert.trigger_data
        }
      });
    } catch (error) {
      console.error('Error escalating to emergency services:', error);
    }
  };

  const notifyEmergencyContacts = async (alert: CrisisAlert) => {
    try {
      for (const contact of emergencyContacts.filter(c => c.is_primary)) {
        await supabase.functions.invoke('notify-emergency-contact', {
          body: {
            contactId: contact.id,
            alertId: alert.id,
            alertType: alert.alert_type,
            severity: alert.severity_level
          }
        });
      }
    } catch (error) {
      console.error('Error notifying emergency contacts:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await supabase
        .from('crisis_alerts')
        .update({ 
          resolution_status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);
      
      await loadCrisisData();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatAlertType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading crisis monitoring system...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency Resources */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Emergency Resources</AlertTitle>
        <AlertDescription className="text-red-700">
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">Emergency: 911</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Crisis Text Line: Text HOME to 741741</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Suicide Prevention Lifeline: 988</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Crisis Monitoring Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Bell className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-600">Active Monitoring</p>
              <p className="text-sm text-gray-600">Real-time crisis detection enabled</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-600">{emergencyContacts.length} Contacts</p>
              <p className="text-sm text-gray-600">Emergency contacts configured</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-therapy-600 mx-auto mb-2" />
              <p className="font-semibold text-therapy-600">Auto-Escalation</p>
              <p className="text-sm text-gray-600">
                {alertSettings.autoEscalation ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Recent Crisis Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {crisisAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-600 mb-2">All Clear</h3>
              <p className="text-gray-600">No crisis indicators detected recently</p>
            </div>
          ) : (
            <div className="space-y-4">
              {crisisAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 border rounded-lg ${getSeverityColor(alert.severity_level)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">
                          {formatAlertType(alert.alert_type)}
                        </Badge>
                        <Badge className={`${alert.severity_level === 'high' ? 'bg-red-600' : alert.severity_level === 'medium' ? 'bg-orange-600' : 'bg-yellow-600'}`}>
                          {alert.severity_level.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Confidence: {(alert.ai_confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                        {alert.resolved_at && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {!alert.resolved_at && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {emergencyContacts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Emergency Contacts</h3>
              <p className="text-gray-600 mb-4">Add emergency contacts for crisis situations</p>
              <Button className="bg-therapy-600 hover:bg-therapy-700">
                Add Emergency Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{contact.name}</h4>
                      {contact.is_primary && (
                        <Badge className="bg-therapy-600">Primary</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {contact.relationship && <span>{contact.relationship} • </span>}
                      {contact.phone_number || contact.email}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {contact.contact_type}
                  </Badge>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                Manage Emergency Contacts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisNotificationSystem;