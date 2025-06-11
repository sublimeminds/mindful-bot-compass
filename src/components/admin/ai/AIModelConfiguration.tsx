
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Settings, Trash2 } from 'lucide-react';
import { AIConfigurationService, AIModelConfig } from '@/services/aiConfigurationService';
import { toast } from 'sonner';

const AIModelConfiguration = () => {
  const [models, setModels] = useState<AIModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModel, setEditingModel] = useState<AIModelConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    provider: 'openai' as 'openai' | 'anthropic',
    model: '',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: '',
    costPerToken: 0.0001,
    capabilities: [] as string[],
    isActive: false
  });

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const modelsList = await AIConfigurationService.getAIModels();
      setModels(modelsList);
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('Failed to load AI models');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModel = async () => {
    try {
      if (editingModel) {
        const success = await AIConfigurationService.updateAIModelConfig(editingModel.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        if (success) {
          toast.success('Model updated successfully');
          await loadModels();
          setEditingModel(null);
        } else {
          toast.error('Failed to update model');
        }
      } else {
        const modelId = await AIConfigurationService.createAIModelConfig({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>);
        
        if (modelId) {
          toast.success('Model created successfully');
          await loadModels();
          setIsCreating(false);
          resetForm();
        } else {
          toast.error('Failed to create model');
        }
      }
    } catch (error) {
      console.error('Error saving model:', error);
      toast.error('Failed to save model');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      provider: 'openai',
      model: '',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: '',
      costPerToken: 0.0001,
      capabilities: [],
      isActive: false
    });
  };

  const startEditing = (model: AIModelConfig) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      provider: model.provider,
      model: model.model,
      temperature: model.temperature,
      maxTokens: model.maxTokens,
      systemPrompt: model.systemPrompt,
      costPerToken: model.costPerToken,
      capabilities: model.capabilities,
      isActive: model.isActive
    });
    setIsCreating(false);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingModel(null);
    resetForm();
  };

  const cancelEditing = () => {
    setEditingModel(null);
    setIsCreating(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">AI Model Configuration</h2>
        <Button onClick={startCreating} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      {/* Model Form */}
      {(isCreating || editingModel) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {isCreating ? 'Create New Model' : 'Edit Model'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Model Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="GPT-4o Mini"
                />
              </div>
              <div>
                <Label htmlFor="provider" className="text-gray-300">Provider</Label>
                <Select value={formData.provider} onValueChange={(value: 'openai' | 'anthropic') => setFormData({ ...formData, provider: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="model" className="text-gray-300">Model ID</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="gpt-4o-mini"
                />
              </div>
              <div>
                <Label htmlFor="temperature" className="text-gray-300">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="maxTokens" className="text-gray-300">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="costPerToken" className="text-gray-300">Cost per Token</Label>
                <Input
                  id="costPerToken"
                  type="number"
                  step="0.000001"
                  value={formData.costPerToken}
                  onChange={(e) => setFormData({ ...formData, costPerToken: parseFloat(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="systemPrompt" className="text-gray-300">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white min-h-32"
                placeholder="You are a helpful AI assistant..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="text-gray-300">Active Model</Label>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSaveModel} className="bg-green-600 hover:bg-green-700">
                {isCreating ? 'Create' : 'Update'} Model
              </Button>
              <Button onClick={cancelEditing} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Models List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id} className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">{model.name}</h3>
                {model.isActive && <Badge className="bg-green-600">Active</Badge>}
              </div>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Provider: {model.provider}</p>
                <p>Model: {model.model}</p>
                <p>Temperature: {model.temperature}</p>
                <p>Max Tokens: {model.maxTokens}</p>
                <p>Cost/Token: ${model.costPerToken}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => startEditing(model)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIModelConfiguration;
