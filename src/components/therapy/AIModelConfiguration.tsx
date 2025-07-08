import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Target
} from 'lucide-react';

const AIModelConfiguration = () => {
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2000]);
  const [enableMultiModel, setEnableMultiModel] = useState(true);
  const [enableMemory, setEnableMemory] = useState(true);
  const [enableCrisisDetection, setEnableCrisisDetection] = useState(true);

  const models = [
    {
      id: 'gpt-4-therapy',
      name: 'GPT-4 Therapy',
      description: 'Primary conversational model with deep therapeutic training',
      status: 'active',
      color: 'from-therapy-500 to-therapy-600',
      icon: Brain
    },
    {
      id: 'claude-empathy',
      name: 'Claude Empathy',
      description: 'Specialized model for emotional understanding and response',
      status: 'active', 
      color: 'from-harmony-500 to-harmony-600',
      icon: Sparkles
    },
    {
      id: 'crisis-detector',
      name: 'Crisis Detection AI',
      description: 'Real-time safety monitoring and intervention system',
      status: 'active',
      color: 'from-red-500 to-red-600',
      icon: AlertTriangle
    }
  ];

  const approaches = [
    {
      id: 'cbt',
      name: 'Cognitive Behavioral Therapy',
      description: 'Evidence-based approach focusing on thought patterns',
      enabled: true,
      effectiveness: 95
    },
    {
      id: 'dbt',
      name: 'Dialectical Behavior Therapy', 
      description: 'Skills-based therapy for emotional regulation',
      enabled: true,
      effectiveness: 88
    },
    {
      id: 'humanistic',
      name: 'Humanistic Therapy',
      description: 'Person-centered approach emphasizing empathy',
      enabled: true,
      effectiveness: 92
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness-Based Therapy',
      description: 'Present-moment awareness and acceptance techniques',
      enabled: false,
      effectiveness: 90
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Model Configuration</h2>
        <p className="text-muted-foreground">
          Customize how your AI therapy models work together to provide personalized support.
        </p>
      </div>

      {/* Active Models */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id} className="border-therapy-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${model.color} rounded-lg flex items-center justify-center`}>
                    <model.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{model.name}</CardTitle>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {model.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{model.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Model Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Model Parameters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Response Creativity: {temperature[0]}
              </label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={1}
                min={0.1}
                step={0.1}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Controls how creative vs. consistent the AI responses are
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Response Length: {maxTokens[0]} tokens
              </label>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={4000}
                min={500}
                step={100}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Maximum length of AI responses
              </p>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Multi-Model Routing</h4>
                <p className="text-sm text-muted-foreground">Use multiple AI models for optimal responses</p>
              </div>
              <Switch checked={enableMultiModel} onCheckedChange={setEnableMultiModel} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Therapeutic Memory</h4>
                <p className="text-sm text-muted-foreground">Remember conversations and build therapeutic rapport</p>
              </div>
              <Switch checked={enableMemory} onCheckedChange={setEnableMemory} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Crisis Detection</h4>
                <p className="text-sm text-muted-foreground">Real-time monitoring for safety and intervention</p>
              </div>
              <Switch checked={enableCrisisDetection} onCheckedChange={setEnableCrisisDetection} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Therapeutic Approaches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Therapeutic Approaches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approaches.map((approach) => (
              <div key={approach.id} className="p-4 border border-therapy-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{approach.name}</h4>
                  <Badge variant={approach.enabled ? "default" : "secondary"}>
                    {approach.effectiveness}% effective
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{approach.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable for your therapy</span>
                  <Switch defaultChecked={approach.enabled} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-therapy-600 hover:bg-therapy-700">
          <Cpu className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default AIModelConfiguration;