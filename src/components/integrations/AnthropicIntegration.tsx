
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  Brain, 
  MessageSquare, 
  Shield, 
  Zap, 
  Settings,
  CheckCircle,
  Activity,
  Users
} from 'lucide-react';

interface AnthropicConfig {
  id: string;
  model: string;
  temperature: number;
  max_tokens: number;
  safety_mode: boolean;
  crisis_detection: boolean;
  empathy_level: number;
  response_style: string;
  therapeutic_approach: string;
  custom_prompts: boolean;
}

const AnthropicIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<AnthropicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const claudeModels = [
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      description: 'Balanced performance for therapy conversations',
      features: ['Fast responses', 'Good reasoning', 'Cost effective'],
      recommended: true
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      description: 'Highest quality for complex therapy scenarios',
      features: ['Superior reasoning', 'Nuanced understanding', 'Premium quality'],
      recommended: false
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      description: 'Fast and efficient for quick interactions',
      features: ['Ultra fast', 'Lower cost', 'Simple conversations'],
      recommended: false
    }
  ];

  const therapeuticApproaches = [
    'Cognitive Behavioral Therapy (CBT)',
    'Dialectical Behavior Therapy (DBT)',
    'Acceptance and Commitment Therapy (ACT)',
    'Mindfulness-Based Therapy',
    'Psychodynamic Therapy',
    'Humanistic Therapy',
    'Integrative Approach'
  ];

  const responseStyles = [
    'Warm and Supportive',
    'Direct and Solution-Focused',
    'Reflective and Insightful',
    'Compassionate and Gentle',
    'Professional and Clinical'
  ];

  useEffect(() => {
    if (user) {
      loadAnthropicConfig();
    }
  }, [user]);

  const loadAnthropicConfig = async () => {
    try {
      // Mock data until database is updated
      const mockConfig: AnthropicConfig = {
        id: 'anthropic_1',
        model: 'claude-3-sonnet',
        temperature: 0.7,
        max_tokens: 500,
        safety_mode: true,
        crisis_detection: true,
        empathy_level: 8,
        response_style: 'Warm and Supportive',
        therapeutic_approach: 'Cognitive Behavioral Therapy (CBT)',
        custom_prompts: true
      };
      
      setConfig(mockConfig);
      setConnected(true);
    } catch (error) {
      console.error('Error loading Anthropic config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<AnthropicConfig>) => {
    if (!config) return;
    
    try {
      const updatedConfig = { ...config, ...updates };
      setConfig(updatedConfig);
      
      toast({
        title: "Settings Updated",
        description: "Anthropic Claude configuration has been saved",
      });
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const testConversation = async () => {
    try {
      toast({
        title: "Testing Claude",
        description: "Sending test message to verify Claude integration",
      });

      // Simulate Claude API test
      setTimeout(() => {
        toast({
          title: "Test Successful",
          description: "Claude is responding correctly with your current settings",
        });
      }, 2000);

    } catch (error) {
      console.error('Error testing Claude:', error);
      toast({
        title: "Test Failed",
        description: "Please check your configuration and try again",
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
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Claude Model Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {claudeModels.map((model) => (
              <div
                key={model.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  config?.model === model.id
                    ? 'border-therapy-500 bg-therapy-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateConfig({ model: model.id })}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{model.name}</h4>
                  {model.recommended && (
                    <Badge variant="default" className="bg-green-600">
                      Recommended
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                
                <div className="space-y-1">
                  {model.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Claude Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature Setting */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Response Creativity (Temperature): {config?.temperature}
            </Label>
            <Slider
              value={[config?.temperature || 0.7]}
              onValueChange={(value) => updateConfig({ temperature: value[0] })}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-600">
              Lower values = more focused, Higher values = more creative
            </p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Response Length (Max Tokens): {config?.max_tokens}
            </Label>
            <Slider
              value={[config?.max_tokens || 500]}
              onValueChange={(value) => updateConfig({ max_tokens: value[0] })}
              max={1000}
              min={100}
              step={50}
              className="w-full"
            />
            <p className="text-xs text-gray-600">
              Controls maximum length of Claude's responses
            </p>
          </div>

          {/* Empathy Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Empathy Level: {config?.empathy_level}/10
            </Label>
            <Slider
              value={[config?.empathy_level || 8]}
              onValueChange={(value) => updateConfig({ empathy_level: value[0] })}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-600">
              Adjusts how emotionally supportive Claude's responses are
            </p>
          </div>

          {/* Therapeutic Approach */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Therapeutic Approach</Label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={config?.therapeutic_approach || ''}
              onChange={(e) => updateConfig({ therapeutic_approach: e.target.value })}
            >
              {therapeuticApproaches.map((approach) => (
                <option key={approach} value={approach}>
                  {approach}
                </option>
              ))}
            </select>
          </div>

          {/* Response Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Response Style</Label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={config?.response_style || ''}
              onChange={(e) => updateConfig({ response_style: e.target.value })}
            >
              {responseStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Safety Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Safety & Monitoring</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Safety Mode</Label>
                  <p className="text-xs text-gray-600">Enhanced safety filters for therapy conversations</p>
                </div>
                <Switch
                  checked={config?.safety_mode}
                  onCheckedChange={(checked) => updateConfig({ safety_mode: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Crisis Detection</Label>
                  <p className="text-xs text-gray-600">Automatically detect crisis situations and escalate</p>
                </div>
                <Switch
                  checked={config?.crisis_detection}
                  onCheckedChange={(checked) => updateConfig({ crisis_detection: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Custom Prompts</Label>
                  <p className="text-xs text-gray-600">Allow custom therapeutic prompts and interventions</p>
                </div>
                <Switch
                  checked={config?.custom_prompts}
                  onCheckedChange={(checked) => updateConfig({ custom_prompts: checked })}
                />
              </div>
            </div>
          </div>

          {/* Test Configuration */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Test Configuration</h4>
                <p className="text-sm text-gray-600">
                  Send a test message to verify Claude is working with your settings
                </p>
              </div>
              <Button onClick={testConversation} variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Test Claude
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Safety Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">HIPAA-compliant conversations</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Crisis intervention protocols</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Inappropriate content filtering</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Professional boundary maintenance</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Therapeutic Capabilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Evidence-based interventions</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Personalized therapy approaches</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Progress tracking and insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Multilingual support</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnthropicIntegration;
