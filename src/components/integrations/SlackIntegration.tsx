import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Settings, Hash, Users, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SlackWorkspace {
  id: string;
  name: string;
  team_id: string;
  access_token: string;
  is_connected: boolean;
  bot_user_id?: string;
}

interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  purpose?: string;
}

const SlackIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<SlackWorkspace[]>([]);
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  const notificationTypes = [
    {
      id: 'session_reminders',
      name: 'Session Reminders',
      description: 'Get notified about upcoming therapy sessions',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      id: 'crisis_alerts',
      name: 'Crisis Alerts',
      description: 'Emergency notifications for crisis situations',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      id: 'progress_updates',
      name: 'Progress Updates',
      description: 'Weekly therapy progress summaries',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      id: 'milestone_celebrations',
      name: 'Milestone Celebrations',
      description: 'Share therapy achievements with your team',
      icon: Zap,
      color: 'bg-purple-500'
    }
  ];

  useEffect(() => {
    if (user) {
      loadSlackWorkspaces();
      generateSampleChannels();
    }
  }, [user]);

  const loadSlackWorkspaces = async () => {
    try {
      // Mock data until database types are updated
      setWorkspaces([]);
    } catch (error) {
      console.error('Error loading Slack workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleChannels = () => {
    const sampleChannels: SlackChannel[] = [
      { id: 'C1234567890', name: 'general', is_private: false, purpose: 'Company-wide announcements' },
      { id: 'C1234567891', name: 'wellness', is_private: false, purpose: 'Mental health and wellness discussions' },
      { id: 'C1234567892', name: 'hr-private', is_private: true, purpose: 'Private HR channel' },
      { id: 'C1234567893', name: 'leadership', is_private: true, purpose: 'Leadership team discussions' }
    ];
    setChannels(sampleChannels);
  };

  const connectSlackWorkspace = async () => {
    try {
      // Simulate Slack OAuth flow
      const mockWorkspace: SlackWorkspace = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Sample Workspace',
        team_id: 'T1234567890',
        access_token: 'xoxb-mock-token',
        is_connected: true,
        bot_user_id: 'U1234567890'
      };

      setWorkspaces([mockWorkspace]);
      
      toast({
        title: "Slack Connected",
        description: "Your Slack workspace has been connected successfully",
      });

    } catch (error) {
      console.error('Error connecting Slack workspace:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect Slack workspace. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnectSlackWorkspace = async (workspaceId: string) => {
    try {
      setWorkspaces(workspaces.filter(w => w.id !== workspaceId));
      
      toast({
        title: "Slack Disconnected",
        description: "Your Slack workspace has been disconnected",
      });

    } catch (error) {
      console.error('Error disconnecting Slack workspace:', error);
    }
  };

  const updateChannelSelection = (notificationType: string, channelId: string) => {
    setSelectedChannels(prev => ({
      ...prev,
      [notificationType]: channelId
    }));
  };

  const sendTestMessage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('slack-webhook', {
        body: {
          action: 'send_test_message',
          channel: selectedChannels.session_reminders || 'general',
          message: 'This is a test message from your therapy app! 🌟'
        }
      });

      if (error) throw error;

      toast({
        title: "Test Message Sent",
        description: "Check your Slack workspace for the test message",
      });

    } catch (error) {
      console.error('Error sending test message:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send test message. Please check your configuration.",
        variant: "destructive"
      });
    }
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
      {/* Slack Workspace Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Slack Workspace</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {workspaces.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Slack Workspace</h3>
              <p className="text-gray-600 mb-6">
                Integrate with Slack to receive therapy notifications and updates directly in your workspace.
              </p>
              <Button onClick={connectSlackWorkspace}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Connect Slack Workspace
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{workspace.name}</h4>
                      <p className="text-sm text-gray-600">Team ID: {workspace.team_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => disconnectSlackWorkspace(workspace.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Channel Configuration */}
      {workspaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hash className="h-5 w-5" />
              <span>Channel Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-600">
              Configure which Slack channels should receive different types of therapy notifications.
            </p>
            
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              
              return (
                <div key={type.id} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${type.color} rounded-lg`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  
                  <div className="ml-11">
                    <Label htmlFor={`channel-${type.id}`} className="text-sm">
                      Select Channel
                    </Label>
                    <select
                      id={`channel-${type.id}`}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-therapy-500 focus:ring-therapy-500 sm:text-sm"
                      value={selectedChannels[type.id] || ''}
                      onChange={(e) => updateChannelSelection(type.id, e.target.value)}
                    >
                      <option value="">Select a channel...</option>
                      {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                          #{channel.name} {channel.is_private ? '(Private)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Slack Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Collaboration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Share therapy milestones with your team</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Get support from colleagues</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Anonymous wellness check-ins</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Mental health resource sharing</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Crisis Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Immediate crisis alerts to leadership</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Automated escalation workflows</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Emergency contact notifications</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Integration with EAP programs</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Test Integration */}
      {workspaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Test Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Send a test message to verify your Slack integration is working correctly.
            </p>
            <Button onClick={sendTestMessage} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Test Message
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SlackIntegration;
