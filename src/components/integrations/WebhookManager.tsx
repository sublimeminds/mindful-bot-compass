
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  TestTube, 
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered: Date | null;
  successCount: number;
  errorCount: number;
  secret: string;
}

const WebhookManager = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [showNewWebhookForm, setShowNewWebhookForm] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[]
  });

  const availableEvents = [
    'user.created',
    'session.started',
    'session.completed',
    'mood.tracked',
    'goal.created',
    'goal.completed',
    'payment.succeeded',
    'payment.failed'
  ];

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockWebhooks: WebhookEndpoint[] = [
        {
          id: '1',
          name: 'Analytics Webhook',
          url: 'https://analytics.example.com/webhook',
          events: ['session.completed', 'mood.tracked'],
          status: 'active',
          lastTriggered: new Date(Date.now() - 3600000),
          successCount: 1247,
          errorCount: 3,
          secret: 'whsec_1234567890abcdef'
        },
        {
          id: '2',
          name: 'Payment Notifications',
          url: 'https://billing.example.com/webhook',
          events: ['payment.succeeded', 'payment.failed'],
          status: 'active',
          lastTriggered: new Date(Date.now() - 7200000),
          successCount: 89,
          errorCount: 0,
          secret: 'whsec_abcdef1234567890'
        },
        {
          id: '3',
          name: 'CRM Integration',
          url: 'https://crm.example.com/webhook',
          events: ['user.created', 'goal.completed'],
          status: 'error',
          lastTriggered: new Date(Date.now() - 86400000),
          successCount: 234,
          errorCount: 12,
          secret: 'whsec_fedcba0987654321'
        }
      ];
      
      setWebhooks(mockWebhooks);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
      toast({
        title: "Error",
        description: "Failed to load webhooks",
        variant: "destructive",
      });
    }
  };

  const createWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one event",
        variant: "destructive",
      });
      return;
    }

    try {
      const webhook: WebhookEndpoint = {
        id: Date.now().toString(),
        name: newWebhook.name,
        url: newWebhook.url,
        events: newWebhook.events,
        status: 'active',
        lastTriggered: null,
        successCount: 0,
        errorCount: 0,
        secret: `whsec_${Math.random().toString(36).substring(2, 18)}`
      };

      setWebhooks(prev => [...prev, webhook]);
      setNewWebhook({ name: '', url: '', events: [] });
      setShowNewWebhookForm(false);

      toast({
        title: "Webhook Created",
        description: "New webhook endpoint has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive",
      });
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== webhookId));
    toast({
      title: "Webhook Deleted",
      description: "Webhook endpoint has been removed",
    });
  };

  const testWebhook = async (webhookId: string) => {
    try {
      // Simulate webhook test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      setWebhooks(prev => prev.map(w => 
        w.id === webhookId 
          ? { 
              ...w, 
              status: isSuccess ? 'active' as const : 'error' as const,
              lastTriggered: new Date(),
              successCount: isSuccess ? w.successCount + 1 : w.successCount,
              errorCount: isSuccess ? w.errorCount : w.errorCount + 1
            }
          : w
      ));

      toast({
        title: isSuccess ? "Test Successful" : "Test Failed",
        description: isSuccess 
          ? "Webhook responded successfully" 
          : "Webhook test failed. Check your endpoint.",
        variant: isSuccess ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Failed to test webhook endpoint",
        variant: "destructive",
      });
    }
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast({
      title: "Secret Copied",
      description: "Webhook secret copied to clipboard",
    });
  };

  const toggleEventSelection = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Webhook className="h-5 w-5 text-therapy-600" />
              <span>Webhook Management</span>
            </div>
            <Button onClick={() => setShowNewWebhookForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">{webhooks.length}</div>
              <p className="text-sm text-muted-foreground">Total Webhooks</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {webhooks.filter(w => w.status === 'active').length}
              </div>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {webhooks.reduce((sum, w) => sum + w.successCount, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Deliveries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Webhook Form */}
      {showNewWebhookForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="webhook-name">Webhook Name</Label>
                <Input
                  id="webhook-name"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Analytics Webhook"
                />
              </div>
              <div>
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://your-app.com/webhook"
                />
              </div>
            </div>

            <div>
              <Label>Events to Subscribe</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {availableEvents.map(event => (
                  <button
                    key={event}
                    onClick={() => toggleEventSelection(event)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      newWebhook.events.includes(event)
                        ? 'bg-therapy-100 border-therapy-300 text-therapy-800'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={createWebhook}>Create Webhook</Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewWebhookForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhook List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(webhook.status)}
                  <span>{webhook.name}</span>
                </div>
                <Badge variant={webhook.status === 'active' ? 'default' : 'destructive'}>
                  {webhook.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <div className="font-medium">Endpoint URL:</div>
                <div className="text-muted-foreground font-mono">{webhook.url}</div>
              </div>

              <div>
                <div className="font-medium text-sm mb-2">Subscribed Events:</div>
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map(event => (
                    <Badge key={event} variant="outline" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Success Count</div>
                  <div className="font-medium text-green-600">{webhook.successCount}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Error Count</div>
                  <div className="font-medium text-red-600">{webhook.errorCount}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Last Triggered</div>
                  <div className="font-medium">
                    {webhook.lastTriggered 
                      ? webhook.lastTriggered.toLocaleString() 
                      : 'Never'
                    }
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Success Rate</div>
                  <div className="font-medium">
                    {webhook.successCount + webhook.errorCount > 0 
                      ? Math.round(webhook.successCount / (webhook.successCount + webhook.errorCount) * 100)
                      : 0
                    }%
                  </div>
                </div>
              </div>

              {/* Webhook Secret */}
              <div className="text-sm">
                <div className="font-medium mb-1">Webhook Secret:</div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {showSecrets[webhook.id] ? webhook.secret : '••••••••••••••••'}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSecrets(prev => ({
                      ...prev,
                      [webhook.id]: !prev[webhook.id]
                    }))}
                  >
                    {showSecrets[webhook.id] ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copySecret(webhook.secret)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => testWebhook(webhook.id)}
                >
                  <TestTube className="h-3 w-3 mr-1" />
                  Test
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteWebhook(webhook.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebhookManager;
