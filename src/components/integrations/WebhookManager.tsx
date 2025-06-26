
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Clock,
  CheckCircle,
  XCircle,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered: string;
  successRate: number;
  description: string;
  headers: Record<string, string>;
}

const WebhookManager = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'Session Completion Webhook',
      url: 'https://api.example.com/webhooks/session-complete',
      method: 'POST',
      events: ['session.completed', 'session.rated'],
      status: 'active',
      lastTriggered: '2 hours ago',
      successRate: 98.5,
      description: 'Triggers when a therapy session is completed or rated',
      headers: { 'Authorization': 'Bearer ***', 'Content-Type': 'application/json' }
    },
    {
      id: '2',
      name: 'User Registration Webhook',
      url: 'https://crm.example.com/api/new-user',
      method: 'POST',
      events: ['user.created', 'user.onboarding_complete'],
      status: 'active',
      lastTriggered: '1 day ago',
      successRate: 100,
      description: 'Sends new user data to CRM system',
      headers: { 'X-API-Key': '***', 'Content-Type': 'application/json' }
    },
    {
      id: '3',
      name: 'Payment Processing Webhook',
      url: 'https://billing.example.com/webhooks/payment',
      method: 'POST',
      events: ['payment.success', 'payment.failed', 'subscription.cancelled'],
      status: 'error',
      lastTriggered: '3 days ago',
      successRate: 45.2,
      description: 'Handles payment and subscription events',
      headers: { 'X-Webhook-Secret': '***' }
    }
  ]);

  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const availableEvents = [
    'user.created',
    'user.onboarding_complete',
    'session.started',
    'session.completed',
    'session.rated',
    'payment.success',
    'payment.failed',
    'subscription.created',
    'subscription.cancelled',
    'mood.tracked',
    'goal.created',
    'goal.completed'
  ];

  const testWebhook = async (webhook: WebhookEndpoint) => {
    toast({
      title: "Testing Webhook",
      description: `Sending test payload to ${webhook.name}...`,
    });

    // Simulate webhook test
    setTimeout(() => {
      toast({
        title: "Webhook Test Complete",
        description: "Test payload sent successfully with 200 response.",
      });
    }, 2000);
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Webhook URL copied to clipboard",
    });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="h-6 w-6 text-therapy-600" />
            <span>Webhook Management</span>
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="webhook-name">Name</Label>
                    <Input id="webhook-name" placeholder="Enter webhook name" />
                  </div>
                  <div>
                    <Label htmlFor="webhook-method">Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="webhook-url">URL</Label>
                  <Input id="webhook-url" placeholder="https://api.example.com/webhook" />
                </div>
                <div>
                  <Label htmlFor="webhook-description">Description</Label>
                  <Textarea id="webhook-description" placeholder="Describe what this webhook does..." />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Webhook
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage webhook endpoints for real-time event notifications to external systems.
          </p>
        </CardContent>
      </Card>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(webhook.status)}
                  <div>
                    <CardTitle className="text-lg">{webhook.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{webhook.method}</Badge>
                      <Badge className={getStatusColor(webhook.status)}>
                        {webhook.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => testWebhook(webhook)}>
                    <Play className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{webhook.description}</p>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <code className="text-sm">{webhook.url}</code>
                <Button size="sm" variant="ghost" onClick={() => copyWebhookUrl(webhook.url)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Events</h4>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Performance</h4>
                  <div className="text-sm">
                    <div>Success Rate: {webhook.successRate}%</div>
                    <div className="text-muted-foreground">Last: {webhook.lastTriggered}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Headers</h4>
                  <div className="text-sm text-muted-foreground">
                    {Object.keys(webhook.headers).length} headers configured
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebhookManager;
