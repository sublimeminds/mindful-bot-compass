
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video,
  Bell,
  Sync,
  CheckCircle,
  Plus
} from 'lucide-react';

interface CalendarConnection {
  id: string;
  provider: string;
  calendar_id: string;
  sync_enabled: boolean;
  two_way_sync: boolean;
}

interface TherapyAppointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_url?: string;
  status: string;
}

const CalendarIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [appointments, setAppointments] = useState<TherapyAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const calendarProviders = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: Calendar,
      description: 'Sync therapy appointments with Google Calendar',
      features: ['Two-way sync', 'Meeting reminders', 'Video call integration', 'Attendee management'],
      color: 'bg-red-500'
    },
    {
      id: 'outlook',
      name: 'Outlook Calendar',
      icon: Calendar,
      description: 'Microsoft Outlook calendar integration',
      features: ['Exchange sync', 'Teams integration', 'Shared calendars', 'Mobile sync'],
      color: 'bg-blue-500'
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: Calendar,
      description: 'iCloud calendar synchronization',
      features: ['iCloud sync', 'Cross-device access', 'Siri integration', 'Family sharing'],
      color: 'bg-gray-600'
    }
  ];

  useEffect(() => {
    if (user) {
      loadCalendarConnections();
      loadAppointments();
    }
  }, [user]);

  const loadCalendarConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading calendar connections:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('therapy_appointments')
        .select('*')
        .eq('user_id', user?.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectCalendar = async (providerId: string) => {
    try {
      const provider = calendarProviders.find(p => p.id === providerId);
      if (!provider) return;

      // Simulate OAuth flow
      const { data, error } = await supabase
        .from('calendar_connections')
        .insert({
          user_id: user?.id!,
          provider: provider.name,
          calendar_id: `${providerId}_${Math.random().toString(36).substr(2, 9)}`,
          sync_enabled: true,
          two_way_sync: false
        })
        .select()
        .single();

      if (error) throw error;

      setConnections([...connections, data]);
      
      toast({
        title: "Calendar Connected",
        description: `${provider.name} has been connected successfully`,
      });

      // Create sample appointments
      setTimeout(() => createSampleAppointments(data.id), 1000);

    } catch (error) {
      console.error('Error connecting calendar:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createSampleAppointments = async (connectionId: string) => {
    try {
      const sampleAppointments = [
        {
          user_id: user?.id!,
          calendar_connection_id: connectionId,
          title: 'Therapy Session with Dr. Smith',
          description: 'Weekly therapy session - CBT focus',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(),
          location: 'Virtual Session',
          meeting_url: 'https://zoom.us/j/123456789',
          appointment_type: 'therapy',
          status: 'scheduled'
        },
        {
          user_id: user?.id!,
          calendar_connection_id: connectionId,
          title: 'Follow-up Consultation',
          description: 'Progress review and goal setting',
          start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          location: 'Wellness Center, Room 201',
          appointment_type: 'consultation',
          status: 'scheduled'
        }
      ];

      for (const appointment of sampleAppointments) {
        await supabase.from('therapy_appointments').insert(appointment);
      }

      await loadAppointments();

      toast({
        title: "Appointments Synced",
        description: "Sample appointments have been created",
      });

    } catch (error) {
      console.error('Error creating sample appointments:', error);
    }
  };

  const updateSyncSettings = async (connectionId: string, settings: Partial<CalendarConnection>) => {
    try {
      const { error } = await supabase
        .from('calendar_connections')
        .update(settings)
        .eq('id', connectionId);

      if (error) throw error;

      setConnections(connections.map(conn => 
        conn.id === connectionId ? { ...conn, ...settings } : conn
      ));

      toast({
        title: "Settings Updated",
        description: "Calendar sync settings have been saved",
      });
    } catch (error) {
      console.error('Error updating sync settings:', error);
    }
  };

  const getConnection = (providerId: string) => {
    return connections.find(c => c.provider.toLowerCase().includes(providerId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calendarProviders.map((provider) => {
          const Icon = provider.icon;
          const connection = getConnection(provider.id);
          const isConnected = !!connection;
          
          return (
            <Card key={provider.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${provider.color} rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{provider.name}</CardTitle>
                      <Badge variant={isConnected ? "default" : "outline"} className="text-xs">
                        {isConnected ? 'Connected' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-therapy-600">{provider.description}</p>
                
                <div>
                  <h5 className="font-medium text-therapy-900 mb-2 text-sm">Features</h5>
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sync Enabled</span>
                      <Switch
                        checked={connection.sync_enabled}
                        onCheckedChange={(checked) => 
                          updateSyncSettings(connection.id, { sync_enabled: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-way Sync</span>
                      <Switch
                        checked={connection.two_way_sync}
                        onCheckedChange={(checked) => 
                          updateSyncSettings(connection.id, { two_way_sync: checked })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => connectCalendar(provider.id)}
                    size="sm" 
                    className="w-full"
                  >
                    Connect {provider.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      {appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Upcoming Appointments</span>
              <Badge variant="outline" className="ml-auto">
                {appointments.length} Scheduled
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium">{appointment.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(appointment.start_time).toLocaleDateString()} at{' '}
                          {new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {appointment.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                    </div>
                    {appointment.description && (
                      <p className="text-sm text-gray-600">{appointment.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                    {appointment.meeting_url && (
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Appointment Card */}
      {connections.length > 0 && (
        <Card className="border-dashed border-2 border-therapy-200">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-2">
              <Plus className="h-12 w-12 text-therapy-400 mx-auto" />
              <h3 className="text-lg font-medium text-therapy-900">Schedule New Appointment</h3>
              <p className="text-therapy-600">Add a new therapy session to your calendar</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarIntegration;
