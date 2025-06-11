
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Brain, Zap, DollarSign, Clock, AlertTriangle, CheckCircle, Save, RotateCcw } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  costPer1kTokens: number;
  avgResponseTime: number;
  maxTokens: number;
  capabilities: string[];
  isActive: boolean;
  isPrimary: boolean;
}

const AIModelConfiguration = () => {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'gpt-4.1-2025-04-14',
      name: 'GPT-4.1 Turbo',
      provider: 'OpenAI',
      description: 'Latest flagship model with superior reasoning',
      costPer1kTokens: 0.03,
      avgResponseTime: 1200,
      maxTokens: 4096,
      capabilities: ['Text', 'Reasoning', 'Analysis'],
      isActive: true,
      isPrimary: true
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      description: 'Fast and cost-effective model for basic interactions',
      costPer1kTokens: 0.0015,
      avgResponseTime: 800,
      maxTokens: 2048,
      capabilities: ['Text', 'Vision'],
      isActive: true,
      isPrimary: false
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    temperature: [0.7],
    maxTokens: [300],
    presencePenalty: [0.6],
    frequencyPenalty: [0.3],
    enableFallback: true,
    enableABTesting: false,
    crisisDetectionSensitivity: [0.8]
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleModelToggle = (modelId: string, field: 'isActive' | 'isPrimary') => {
    setModels(prev => prev.map(model => {
      if (model.id === modelId) {
        return { ...model, [field]: !model[field] };
      }
      if (field === 'isPrimary' && model[field]) {
        return { ...model, [field]: false };
      }
      return model;
    }));
    setHasChanges(true);
  };

  const handleSettingChange = (setting: string, value: any) => {
    setGlobalSettings(prev => ({ ...prev, [setting]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save configuration logic here
    console.log('Saving AI model configuration:', { models, globalSettings });
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to defaults
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Global AI Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            Global AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Temperature (Creativity): {globalSettings.temperature[0]}
                </label>
                <Slider
                  value={globalSettings.temperature}
                  onValueChange={(value) => handleSettingChange('temperature', value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">Lower = more focused, Higher = more creative</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Max Response Tokens: {globalSettings.maxTokens[0]}
                </label>
                <Slider
                  value={globalSettings.maxTokens}
                  onValueChange={(value) => handleSettingChange('maxTokens', value)}
                  max={1000}
                  min={50}
                  step={25}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Crisis Detection Sensitivity: {globalSettings.crisisDetectionSensitivity[0]}
                </label>
                <Slider
                  value={globalSettings.crisisDetectionSensitivity}
                  onValueChange={(value) => handleSettingChange('crisisDetectionSensitivity', value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">Higher = more sensitive to crisis indicators</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Enable Model Fallback</span>
                  <Switch
                    checked={globalSettings.enableFallback}
                    onCheckedChange={(checked) => handleSettingChange('enableFallback', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white">Enable A/B Testing</span>
                  <Switch
                    checked={globalSettings.enableABTesting}
                    onCheckedChange={(checked) => handleSettingChange('enableABTesting', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Management */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Available AI Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.map((model) => (
              <div key={model.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-medium">{model.name}</h3>
                      <Badge variant="outline" className="text-xs">{model.provider}</Badge>
                      {model.isPrimary && <Badge className="text-xs bg-purple-600">Primary</Badge>}
                      {model.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{model.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ${model.costPer1kTokens}/1K tokens
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {model.avgResponseTime}ms avg
                      </span>
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        {model.maxTokens} max tokens
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-white">Active</span>
                      <Switch
                        checked={model.isActive}
                        onCheckedChange={() => handleModelToggle(model.id, 'isActive')}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-white">Primary</span>
                      <Switch
                        checked={model.isPrimary}
                        onCheckedChange={() => handleModelToggle(model.id, 'isPrimary')}
                        disabled={!model.isActive}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {model.capabilities.map((capability) => (
                    <Badge key={capability} variant="secondary" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIModelConfiguration;
