
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Key, 
  Webhook, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2,
  ExternalLink,
  Globe,
  Lock,
  Activity
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key_hash: string;
  permissions: any;
  rate_limit: number;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

interface Webhook {
  id: string;
  url: string;
  event_types: string[];
  is_active: boolean;
  created_at: string;
}

const APIManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const availableEvents = [
    'session.started',
    'session.completed',
    'mood.updated',
    'goal.created',
    'goal.completed',
    'crisis.detected',
    'integration.connected',
    'integration.disconnected'
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/profile',
      description: 'Get user profile information',
      auth: 'Required'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/sessions',
      description: 'List therapy sessions',
      auth: 'Required'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/sessions',
      description: 'Create a new therapy session',
      auth: 'Required'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/mood',
      description: 'Get mood tracking data',
      auth: 'Required'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/mood',
      description: 'Log mood entry',
      auth: 'Required'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/goals',
      description: 'List user goals',
      auth: 'Required'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/webhooks',
      description: 'Create webhook endpoint',
      auth: 'Required'
    }
  ];

  useEffect(() => {
    if (user) {
      loadAPIKeys();
      loadWebhooks();
    }
  }, [user]);

  const loadAPIKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  };

  const loadWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error loading webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAPIKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a random API key
      const apiKey = 'tk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user?.id,
          name: newKeyName,
          key_hash: btoa(apiKey), // Simple encoding for demo
          permissions: { read: true, write: false },
          rate_limit: 1000
        });

      if (error) throw error;

      toast({
        title: "API Key Created",
        description: `Your API key: ${apiKey}. Please save it securely.`,
      });

      setNewKeyName('');
      setShowCreateKey(false);
      loadAPIKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive"
      });
    }
  };

  const createWebhook = async () => {
    if (!newWebhookUrl.trim() || selectedEvents.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL and select at least one event",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('webhooks')
        .insert({
          user_id: user?.id,
          url: newWebhookUrl,
          event_types: selectedEvents,
          secret: Math.random().toString(36).substring(2, 15)
        });

      if (error) throw error;

      toast({
        title: "Webhook Created",
        description: "Your webhook has been created successfully",
      });

      setNewWebhookUrl('');
      setSelectedEvents([]);
      setShowCreateWebhook(false);
      loadWebhooks();
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive"
      });
    }
  };

  const deleteAPIKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      toast({
        title: "API Key Deleted",
        description: "The API key has been deleted successfully",
      });

      loadAPIKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
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
      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="docs">
            <ExternalLink className="h-4 w-4 mr-2" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-therapy-900">API Keys</h3>
              <p className="text-sm text-therapy-600">Manage your API keys for programmatic access</p>
            </div>
            <Button onClick={() => setShowCreateKey(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>

          {showCreateKey && (
            <Card>
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="API Key Name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button onClick={generateAPIKey}>Create Key</Button>
                  <Button variant="outline" onClick={() => setShowCreateKey(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {apiKeys.map((key) => (
              <Card key={key.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-therapy-600" />
                        <span className="font-medium">{key.name}</span>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-therapy-600">
                        Rate limit: {key.rate_limit} requests/hour
                      </p>
                      <p className="text-xs text-therapy-500">
                        Created: {new Date(key.created_at).toLocaleDateString()}
                        {key.last_used_at && ` • Last used: ${new Date(key.last_used_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAPIKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-therapy-900">Webhooks</h3>
              <p className="text-sm text-therapy-600">Receive real-time notifications for events</p>
            </div>
            <Button onClick={() => setShowCreateWebhook(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </div>

          {showCreateWebhook && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Webhook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Webhook URL (https://...)"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                />
                <div>
                  <label className="text-sm font-medium">Event Types</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableEvents.map((event) => (
                      <label key={event} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEvents([...selectedEvents, event]);
                            } else {
                              setSelectedEvents(selectedEvents.filter(e => e !== event));
                            }
                          }}
                        />
                        <span className="text-sm">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={createWebhook}>Create Webhook</Button>
                  <Button variant="outline" onClick={() => setShowCreateWebhook(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-therapy-600" />
                        <span className="font-medium">{webhook.url}</span>
                        <Badge variant={webhook.is_active ? "default" : "secondary"}>
                          {webhook.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {webhook.event_types.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-therapy-500">
                      Created: {new Date(webhook.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <p className="text-therapy-600">Available endpoints and their usage</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border-l-4 border-therapy-200 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        {endpoint.auth}
                      </Badge>
                    </div>
                    <p className="text-sm text-therapy-600">{endpoint.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-therapy-50 rounded-lg">
                <h4 className="font-medium text-therapy-900 mb-2">Authentication</h4>
                <p className="text-sm text-therapy-600 mb-2">
                  Include your API key in the Authorization header:
                </p>
                <code className="text-sm bg-white p-2 rounded border block">
                  Authorization: Bearer your_api_key_here
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIManagement;
