
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  Zap, 
  Workflow, 
  ArrowRight, 
  Plus, 
  Play,
  Pause,
  Settings,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ZapierWorkflow {
  id: string;
  name: string;
  trigger_type: string;
  actions: string[];
  is_active: boolean;
  webhook_url: string;
  last_triggered: string | null;
  run_count: number;
}

const ZapierIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<ZapierWorkflow[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const automationTemplates = [
    {
      id: 'session-reminders',
      name: 'Session Reminders',
      icon: Clock,
      description: 'Automatically send therapy session reminders via email or SMS',
      trigger: 'New Session Scheduled',
      actions: ['Send Email', 'Send SMS', 'Create Calendar Event'],
      color: 'bg-blue-500'
    },
    {
      id: 'crisis-alerts',
      name: 'Crisis Alerts',
      icon: Zap,
      description: 'Trigger emergency workflows when crisis indicators are detected',
      trigger: 'Crisis Assessment Completed',
      actions: ['Notify Emergency Contacts', 'Create Support Ticket', 'Schedule Follow-up'],
      color: 'bg-red-500'
    },
    {
      id: 'progress-updates',
      name: 'Progress Updates',
      icon: CheckCircle,
      description: 'Share therapy progress with care team and family members',
      trigger: 'Milestone Achieved',
      actions: ['Update CRM', 'Send Progress Report', 'Notify Therapist'],
      color: 'bg-green-500'
    },
    {
      id: 'goal-tracking',
      name: 'Goal Tracking',
      icon: Workflow,
      description: 'Sync therapy goals with project management and tracking tools',
      trigger: 'Goal Created/Updated',
      actions: ['Create Trello Card', 'Update Notion', 'Send Slack Message'],
      color: 'bg-purple-500'
    }
  ];

  useEffect(() => {
    if (user) {
      loadZapierWorkflows();
    }
  }, [user]);

  const loadZapierWorkflows = async () => {
    try {
      // Mock data until database is updated
      const mockWorkflows: ZapierWorkflow[] = [
        {
          id: 'workflow_1',
          name: 'Session Reminder Automation',
          trigger_type: 'session_scheduled',
          actions: ['Send Email Reminder', 'Create Calendar Event'],
          is_active: true,
          webhook_url: 'https://hooks.zapier.com/hooks/catch/12345/session-reminder',
          last_triggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          run_count: 24
        }
      ];
      
      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('Error loading Zapier workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async (templateId: string) => {
    try {
      if (!newWebhookUrl) {
        toast({
          title: "Webhook URL Required",
          description: "Please enter your Zapier webhook URL first",
          variant: "destructive"
        });
        return;
      }

      const template = automationTemplates.find(t => t.id === templateId);
      if (!template) return;

      const newWorkflow: ZapierWorkflow = {
        id: Math.random().toString(36).substr(2, 9),
        name: template.name,
        trigger_type: templateId,
        actions: template.actions,
        is_active: true,
        webhook_url: newWebhookUrl,
        last_triggered: null,
        run_count: 0
      };

      setWorkflows([...workflows, newWorkflow]);
      setNewWebhookUrl('');
      
      toast({
        title: "Workflow Created",
        description: `${template.name} automation has been set up successfully`,
      });

    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleWorkflow = async (workflowId: string, isActive: boolean) => {
    try {
      setWorkflows(workflows.map(w => 
        w.id === workflowId ? { ...w, is_active: isActive } : w
      ));

      toast({
        title: isActive ? "Workflow Activated" : "Workflow Paused",
        description: `The automation has been ${isActive ? 'activated' : 'paused'}`,
      });
    } catch (error) {
      console.error('Error toggling workflow:', error);
    }
  };

  const testWorkflow = async (workflowId: string) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) return;

      toast({
        title: "Testing Workflow",
        description: "Sending test trigger to your Zapier webhook",
      });

      // Simulate API call to Zapier webhook
      const response = await fetch(workflow.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          test: true,
          workflow_id: workflowId,
          trigger_type: workflow.trigger_type,
          timestamp: new Date().toISOString(),
          user_id: user?.id,
          data: {
            message: 'This is a test trigger from your therapy app'
          }
        }),
      });

      // Update last triggered time
      setWorkflows(workflows.map(w => 
        w.id === workflowId 
          ? { ...w, last_triggered: new Date().toISOString(), run_count: w.run_count + 1 }
          : w
      ));

      toast({
        title: "Test Successful",
        description: "Check your Zapier dashboard to see if the workflow was triggered",
      });

    } catch (error) {
      console.error('Error testing workflow:', error);
      toast({
        title: "Test Failed",
        description: "Failed to trigger the workflow. Please check your webhook URL.",
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
      {/* Automation Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automationTemplates.map((template) => {
          const Icon = template.icon;
          const existingWorkflow = workflows.find(w => w.trigger_type === template.id);
          
          return (
            <Card key={template.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${template.color} rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <p className="text-sm text-therapy-600">{template.description}</p>
                    </div>
                  </div>
                  {existingWorkflow && (
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">Trigger:</span>
                    <Badge variant="outline">{template.trigger}</Badge>
                  </div>
                  
                  <div>
                    <span className="font-medium text-sm">Actions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.actions.map((action, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {!existingWorkflow ? (
                  <Button 
                    onClick={() => createWorkflow(template.id)}
                    size="sm" 
                    className="w-full"
                    disabled={!newWebhookUrl}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      Runs: {existingWorkflow.run_count}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => toggleWorkflow(existingWorkflow.id, !existingWorkflow.is_active)}
                        variant="outline"
                        size="sm"
                      >
                        {existingWorkflow.is_active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        onClick={() => testWorkflow(existingWorkflow.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Webhook Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Workflow className="h-5 w-5" />
            <span>Zapier Webhook Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/12345/abc123"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-1">
                Create a new Zap in Zapier and use the webhook URL provided by the "Webhooks by Zapier" trigger
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How to set up Zapier integration:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                <li>Go to Zapier and create a new Zap</li>
                <li>Choose "Webhooks by Zapier" as your trigger</li>
                <li>Select "Catch Hook" as the trigger event</li>
                <li>Copy the webhook URL provided by Zapier</li>
                <li>Paste it in the field above and create your workflow</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      {workflows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Active Workflows</span>
              <Badge variant="outline" className="ml-auto">
                {workflows.filter(w => w.is_active).length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{workflow.name}</h4>
                    <Badge variant={workflow.is_active ? "default" : "secondary"}>
                      {workflow.is_active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Runs: {workflow.run_count}</span>
                    {workflow.last_triggered && (
                      <span>
                        Last triggered: {new Date(workflow.last_triggered).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Switch
                    checked={workflow.is_active}
                    onCheckedChange={(checked) => toggleWorkflow(workflow.id, checked)}
                  />
                  <Button
                    onClick={() => testWorkflow(workflow.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ZapierIntegration;
