
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
  Globe, 
  Activity, 
  Settings, 
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ExternalLink,
  Webhook,
  Code,
  BarChart3
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key_hash: string;
  permissions: any;
  rate_limit: number;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  event_types: string[];
  is_active: boolean;
  created_at: string;
}

const EnhancedAPIManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/profile',
      description: 'Get user profile information',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://your-app.com/api/v1/profile'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/sessions',
      description: 'List therapy sessions',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://your-app.com/api/v1/sessions'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/sessions',
      description: 'Create a new therapy session',
      example: 'curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d \'{"title":"Session Name"}\' https://your-app.com/api/v1/sessions'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/mood',
      description: 'Get mood entries',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://your-app.com/api/v1/mood'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/mood',
      description: 'Create mood entry',
      example: 'curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d \'{"overall":7,"anxiety":3}\' https://your-app.com/api/v1/mood'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/goals',
      description: 'List user goals',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://your-app.com/api/v1/goals'
    }
  ];

  const webhookEvents = [
    'session.created',
    'session.completed',
    'mood.recorded',
    'goal.achieved',
    'crisis.detected',
    'integration.connected'
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
    } finally {
      setLoading(false);
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
      const apiKey = `tk_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      const keyHash = btoa(apiKey); // Simple base64 encoding for demo

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user?.id,
          name: newKeyName,
          key_hash: keyHash,
          permissions: { read: true, write: false },
          rate_limit: 1000,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setApiKeys([data, ...apiKeys]);
      setNewKeyName('');

      // Show the actual key to the user (only this once)
      toast({
        title: "API Key Generated",
        description: `Your API key: ${apiKey} (save this now, you won't see it again!)`,
      });

    } catch (error) {
      console.error('Error generating API key:', error);
      toast({
        title: "Error",
        description: "Failed to generate API key",
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

      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast({
        title: "API Key Deleted",
        description: "The API key has been permanently deleted",
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive"
      });
    }
  };

  const addWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          user_id: user?.id,
          url: newWebhookUrl,
          event_types: ['session.created', 'mood.recorded'],
          is_active: true,
          secret: Math.random().toString(36).substring(2)
        })
        .select()
        .single();

      if (error) throw error;

      setWebhooks([data, ...webhooks]);
      setNewWebhookUrl('');

      toast({
        title: "Webhook Added",
        description: "Your webhook endpoint has been configured",
      });

    } catch (error) {
      console.error('Error adding webhook:', error);
      toast({
        title: "Error",
        description: "Failed to add webhook",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="docs">
            <Code className="h-4 w-4 mr-2" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <p className="text-sm text-therapy-600">
                Generate and manage API keys for accessing your therapy data programmatically
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter API key name (e.g., 'Mobile App', 'Dashboard')"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={generateAPIKey}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Key
                </Button>
              </div>

              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{key.name}</h4>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {showKeys[key.id] ? key.key_hash : '••••••••••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowKeys({...showKeys, [key.id]: !showKeys[key.id]})}
                        >
                          {showKeys[key.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.key_hash)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Rate limit: {key.rate_limit}/hour • 
                        Last used: {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAPIKey(key.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {apiKeys.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No API keys generated yet</p>
                    <p className="text-sm">Create your first API key to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <p className="text-sm text-therapy-600">
                Complete reference for integrating with the TherapySync API
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Base URL</h4>
                <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded">
                  https://your-app.com/api/v1
                </code>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Available Endpoints</h4>
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                        className={endpoint.method === 'GET' ? 'bg-green-600' : 'bg-blue-600'}
                      >
                        {endpoint.method}
                      </Badge>
                      <div className="flex-1">
                        <code className="font-mono text-sm">{endpoint.endpoint}</code>
                        <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                        <details className="mt-2">
                          <summary className="text-sm font-medium cursor-pointer">Example</summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                            {endpoint.example}
                          </pre>
                        </details>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Authentication</h4>
                <p className="text-sm text-yellow-800">
                  Include your API key in the Authorization header:
                </p>
                <pre className="text-xs bg-yellow-100 p-2 rounded mt-2">
                  Authorization: Bearer YOUR_API_KEY
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <p className="text-sm text-therapy-600">
                Receive real-time notifications when events occur in your therapy app
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="https://your-app.com/webhook"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addWebhook}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>

              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <code className="text-sm">{webhook.url}</code>
                          <Badge variant={webhook.is_active ? "default" : "secondary"}>
                            {webhook.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">Events:</p>
                          <div className="flex flex-wrap gap-1">
                            {webhook.event_types.map((event) => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {webhooks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No webhooks configured</p>
                    <p className="text-sm">Add a webhook to receive real-time notifications</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Available Events</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {webhookEvents.map((event) => (
                    <Badge key={event} variant="outline" className="justify-center">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>API analytics coming soon</p>
                <p className="text-sm">Track API usage, response times, and error rates</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAPIManagement;
