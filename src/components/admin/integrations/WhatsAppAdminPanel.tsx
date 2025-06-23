
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  MessageSquare, 
  BarChart3, 
  AlertTriangle,
  Check,
  Plus,
  Edit,
  Trash2,
  TestTube
} from 'lucide-react';

const WhatsAppAdminPanel = () => {
  const { toast } = useToast();
  const [globalConfig, setGlobalConfig] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [systemPrompts, setSystemPrompts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [configResult, templatesResult, promptsResult, analyticsResult] = await Promise.all([
        supabase.from('whatsapp_global_config').select('*').maybeSingle(),
        supabase.from('whatsapp_response_templates').select('*').order('category', { ascending: true }),
        supabase.from('whatsapp_system_prompts').select('*').order('personality_type', { ascending: true }),
        supabase.from('whatsapp_usage_analytics').select('*').order('date', { ascending: false }).limit(7)
      ]);

      setGlobalConfig(configResult.data);
      setTemplates(templatesResult.data || []);
      setSystemPrompts(promptsResult.data || []);
      setAnalytics(analyticsResult.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load configuration data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGlobalConfig = async (configData: any) => {
    try {
      const { error } = await supabase
        .from('whatsapp_global_config')
        .upsert({
          ...configData,
          id: globalConfig?.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Configuration Saved",
        description: "Global WhatsApp configuration has been updated.",
      });
      loadAdminData();
    } catch (error) {
      console.error('Error saving global config:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      });
    }
  };

  const testWebhook = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-system-test', {
        body: { test_type: 'webhook' }
      });

      if (error) throw error;

      toast({
        title: "Webhook Test",
        description: data?.success ? "Webhook is working correctly!" : "Webhook test failed.",
        variant: data?.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Test Failed",
        description: "Could not test webhook connectivity.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="config" className="data-[state=active]:bg-blue-600">
            <Settings className="h-4 w-4 mr-2" />
            Global Config
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="prompts" className="data-[state=active]:bg-blue-600">
            <Edit className="h-4 w-4 mr-2" />
            AI Prompts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <GlobalConfigTab 
            config={globalConfig} 
            onSave={saveGlobalConfig}
            onTest={testWebhook}
          />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesTab 
            templates={templates} 
            onRefresh={loadAdminData}
          />
        </TabsContent>

        <TabsContent value="prompts">
          <PromptsTab 
            prompts={systemPrompts} 
            onRefresh={loadAdminData}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const GlobalConfigTab = ({ config, onSave, onTest }: any) => {
  const [formData, setFormData] = useState({
    business_account_id: '',
    phone_number_id: '',
    access_token_encrypted: '',
    webhook_verify_token: '',
    webhook_url: '',
    is_active: false,
    rate_limit_per_hour: 1000,
    crisis_escalation_enabled: true,
    message_monitoring_enabled: true,
    ...config
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-400" />
            WhatsApp Business API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_account_id" className="text-gray-300">Business Account ID</Label>
              <Input
                id="business_account_id"
                value={formData.business_account_id}
                onChange={(e) => setFormData(prev => ({ ...prev, business_account_id: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter Business Account ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number_id" className="text-gray-300">Phone Number ID</Label>
              <Input
                id="phone_number_id"
                value={formData.phone_number_id}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number_id: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter Phone Number ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="access_token" className="text-gray-300">Access Token</Label>
            <Input
              id="access_token"
              type="password"
              value={formData.access_token_encrypted}
              onChange={(e) => setFormData(prev => ({ ...prev, access_token_encrypted: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter Access Token"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="webhook_verify_token" className="text-gray-300">Webhook Verify Token</Label>
              <Input
                id="webhook_verify_token"
                value={formData.webhook_verify_token}
                onChange={(e) => setFormData(prev => ({ ...prev, webhook_verify_token: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter Webhook Token"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate_limit" className="text-gray-300">Rate Limit (per hour)</Label>
              <Input
                id="rate_limit"
                type="number"
                value={formData.rate_limit_per_hour}
                onChange={(e) => setFormData(prev => ({ ...prev, rate_limit_per_hour: parseInt(e.target.value) }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Integration Active</Label>
                <p className="text-sm text-gray-400">Enable WhatsApp integration system-wide</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Crisis Escalation</Label>
                <p className="text-sm text-gray-400">Automatically escalate crisis situations</p>
              </div>
              <Switch
                checked={formData.crisis_escalation_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, crisis_escalation_enabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Message Monitoring</Label>
                <p className="text-sm text-gray-400">Monitor and log all WhatsApp messages</p>
              </div>
              <Switch
                checked={formData.message_monitoring_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, message_monitoring_enabled: checked }))}
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Check className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            <Button type="button" variant="outline" onClick={onTest}>
              <TestTube className="h-4 w-4 mr-2" />
              Test Webhook
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

const TemplatesTab = ({ templates, onRefresh }: any) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-white flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
          Response Templates
        </CardTitle>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {templates.map((template: any) => (
          <div key={template.id} className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-white">{template.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                {template.is_active && (
                  <Badge className="text-xs bg-green-600">Active</Badge>
                )}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-2">{template.template_text}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Used {template.usage_count} times</span>
              <span>Priority: {template.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const PromptsTab = ({ prompts, onRefresh }: any) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-white flex items-center">
          <Edit className="h-5 w-5 mr-2 text-blue-400" />
          AI System Prompts
        </CardTitle>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Prompt
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {prompts.map((prompt: any) => (
          <div key={prompt.id} className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-white">{prompt.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {prompt.personality_type}
                </Badge>
                {prompt.is_default && (
                  <Badge className="text-xs bg-yellow-600">Default</Badge>
                )}
                {prompt.is_active && (
                  <Badge className="text-xs bg-green-600">Active</Badge>
                )}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-2">{prompt.system_prompt}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Effectiveness: {(prompt.effectiveness_score * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const AnalyticsTab = ({ analytics }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
          Usage Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Total Messages</span>
            <span className="text-white font-medium">
              {analytics?.reduce((sum: number, day: any) => sum + day.total_messages, 0) || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">AI Responses</span>
            <span className="text-white font-medium">
              {analytics?.reduce((sum: number, day: any) => sum + day.ai_responses, 0) || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Active Users</span>
            <span className="text-white font-medium">
              {analytics?.[0]?.active_users || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Crisis Interventions</span>
            <span className="text-white font-medium">
              {analytics?.reduce((sum: number, day: any) => sum + day.crisis_interventions, 0) || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Error Count (7 days)</span>
            <span className="text-white font-medium">
              {analytics?.reduce((sum: number, day: any) => sum + day.error_count, 0) || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Average Response Time</span>
            <span className="text-white font-medium">
              {analytics?.[0]?.average_response_time || 0}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">System Status</span>
            <Badge className="bg-green-600">Operational</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default WhatsAppAdminPanel;
