import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Brain, 
  Shield, 
  Zap, 
  User,
  MessageSquare,
  Clock,
  Target,
  Activity,
  Heart,
  Lightbulb,
  Volume2,
  Database,
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AISettings {
  // Personality Settings
  communicationStyle: 'supportive' | 'direct' | 'gentle' | 'professional';
  empathyLevel: number;
  responsiveness: number;
  proactivity: number;
  
  // Interaction Preferences
  conversationTone: 'casual' | 'formal' | 'therapeutic';
  responseLength: 'brief' | 'moderate' | 'detailed';
  useEmoji: boolean;
  personalizedGreeting: boolean;
  
  // Learning & Adaptation
  learningRate: number;
  adaptationSpeed: number;
  memoryRetention: number;
  contextSensitivity: number;
  
  // Privacy & Security
  dataRetention: 'session' | 'week' | 'month' | 'permanent';
  shareAnonymizedData: boolean;
  crossSessionLearning: boolean;
  encryptConversations: boolean;
  
  // Feature Toggles
  voiceInteraction: boolean;
  smartRecommendations: boolean;
  contextualAwareness: boolean;
  moodTracking: boolean;
  goalIntegration: boolean;
  crisisDetection: boolean;
  
  // Advanced Settings
  modelPreference: 'balanced' | 'creative' | 'analytical' | 'therapeutic';
  responseConfidenceThreshold: number;
  customInstructions: string;
  
  // Notification Settings
  reminderFrequency: 'none' | 'daily' | 'weekly';
  insightNotifications: boolean;
  progressAlerts: boolean;
}

const AISettingsConfiguration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Default settings
  const defaultSettings: AISettings = {
    communicationStyle: 'supportive',
    empathyLevel: 80,
    responsiveness: 70,
    proactivity: 60,
    conversationTone: 'therapeutic',
    responseLength: 'moderate',
    useEmoji: true,
    personalizedGreeting: true,
    learningRate: 75,
    adaptationSpeed: 65,
    memoryRetention: 85,
    contextSensitivity: 80,
    dataRetention: 'month',
    shareAnonymizedData: false,
    crossSessionLearning: true,
    encryptConversations: true,
    voiceInteraction: true,
    smartRecommendations: true,
    contextualAwareness: true,
    moodTracking: true,
    goalIntegration: true,
    crisisDetection: true,
    modelPreference: 'therapeutic',
    responseConfidenceThreshold: 70,
    customInstructions: '',
    reminderFrequency: 'weekly',
    insightNotifications: true,
    progressAlerts: true,
  };

  useEffect(() => {
    // Load saved settings or use defaults
    const savedSettings = localStorage.getItem('ai-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings(defaultSettings);
    }
  }, []);

  const updateSetting = <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
    if (!settings) return;
    
    setSettings(prev => ({ ...prev!, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('ai-settings', JSON.stringify(settings));
      setHasChanges(false);
      setIsLoading(false);
      
      toast({
        title: "Settings Saved",
        description: "Your AI personalization settings have been updated successfully.",
      });
    }, 1000);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
    });
  };

  const exportSettings = () => {
    if (!settings) return;
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-settings-export.json';
    link.click();
    
    toast({
      title: "Settings Exported",
      description: "Your AI settings have been downloaded as a JSON file.",
    });
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        setHasChanges(true);
        
        toast({
          title: "Settings Imported",
          description: "Your AI settings have been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import settings. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  if (!settings) {
    return <div className="flex items-center justify-center h-96">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Settings & Configuration</h1>
          <p className="text-gray-600 mt-2">Customize how your AI assistant behaves and learns</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('import-input')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <input
            id="import-input"
            type="file"
            accept=".json"
            onChange={importSettings}
            className="hidden"
          />
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={saveSettings} 
            disabled={!hasChanges || isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      {/* Change Indicator */}
      {hasChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">You have unsaved changes</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="personality" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="interaction">Interaction</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Personality Settings */}
        <TabsContent value="personality">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-therapy-600" />
                <span>AI Personality Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="communication-style">Communication Style</Label>
                  <Select 
                    value={settings.communicationStyle} 
                    onValueChange={(value: AISettings['communicationStyle']) => 
                      updateSetting('communicationStyle', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supportive">Supportive & Encouraging</SelectItem>
                      <SelectItem value="direct">Direct & Clear</SelectItem>
                      <SelectItem value="gentle">Gentle & Nurturing</SelectItem>
                      <SelectItem value="professional">Professional & Structured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="conversation-tone">Conversation Tone</Label>
                  <Select 
                    value={settings.conversationTone} 
                    onValueChange={(value: AISettings['conversationTone']) => 
                      updateSetting('conversationTone', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="formal">Formal & Respectful</SelectItem>
                      <SelectItem value="therapeutic">Therapeutic & Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Empathy Level: {settings.empathyLevel}%</Label>
                  <Slider
                    value={[settings.empathyLevel]}
                    onValueChange={([value]) => updateSetting('empathyLevel', value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Higher values make the AI more emotionally responsive and understanding
                  </p>
                </div>

                <div>
                  <Label>Responsiveness: {settings.responsiveness}%</Label>
                  <Slider
                    value={[settings.responsiveness]}
                    onValueChange={([value]) => updateSetting('responsiveness', value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How quickly the AI responds to your emotional cues and needs
                  </p>
                </div>

                <div>
                  <Label>Proactivity: {settings.proactivity}%</Label>
                  <Slider
                    value={[settings.proactivity]}
                    onValueChange={([value]) => updateSetting('proactivity', value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How likely the AI is to offer suggestions and take initiative
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Use Emojis</Label>
                  <p className="text-sm text-gray-500">Include emojis in AI responses</p>
                </div>
                <Switch
                  checked={settings.useEmoji}
                  onCheckedChange={(checked) => updateSetting('useEmoji', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Personalized Greeting</Label>
                  <p className="text-sm text-gray-500">Use your name and context in greetings</p>
                </div>
                <Switch
                  checked={settings.personalizedGreeting}
                  onCheckedChange={(checked) => updateSetting('personalizedGreeting', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interaction Settings */}
        <TabsContent value="interaction">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-therapy-600" />
                <span>Interaction Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="response-length">Response Length</Label>
                <Select 
                  value={settings.responseLength} 
                  onValueChange={(value: AISettings['responseLength']) => 
                    updateSetting('responseLength', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief & Concise</SelectItem>
                    <SelectItem value="moderate">Moderate Detail</SelectItem>
                    <SelectItem value="detailed">Detailed & Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="custom-instructions">Custom Instructions</Label>
                <Textarea
                  id="custom-instructions"
                  value={settings.customInstructions}
                  onChange={(e) => updateSetting('customInstructions', e.target.value)}
                  placeholder="Add specific instructions for how you want the AI to interact with you..."
                  rows={4}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  These instructions will guide how the AI communicates with you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Voice Interaction</Label>
                    <p className="text-sm text-gray-500">Enable voice input and output</p>
                  </div>
                  <Switch
                    checked={settings.voiceInteraction}
                    onCheckedChange={(checked) => updateSetting('voiceInteraction', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Smart Recommendations</Label>
                    <p className="text-sm text-gray-500">Get proactive suggestions</p>
                  </div>
                  <Switch
                    checked={settings.smartRecommendations}
                    onCheckedChange={(checked) => updateSetting('smartRecommendations', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Settings */}
        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-therapy-600" />
                <span>Learning & Adaptation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Learning Rate: {settings.learningRate}%</Label>
                  <Slider
                    value={[settings.learningRate]}
                    onValueChange={([value]) => updateSetting('learningRate', value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How quickly the AI adapts to your preferences and patterns
                  </p>
                </div>

                <div>
                  <Label>Memory Retention: {settings.memoryRetention}%</Label>
                  <Slider
                    value={[settings.memoryRetention]}
                    onValueChange={([value]) => updateSetting('memoryRetention', value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How long the AI remembers your conversations and preferences
                  </p>
                </div>

                <div>
                  <Label>Context Sensitivity: {settings.contextSensitivity}%</Label>
                  <Slider
                    value={[settings.contextSensitivity]}
                    onValueChange={([value]) => updateSetting('contextSensitivity', value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How much the AI considers your current situation and mood
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Cross-Session Learning</Label>
                  <p className="text-sm text-gray-500">Learn from previous conversations</p>
                </div>
                <Switch
                  checked={settings.crossSessionLearning}
                  onCheckedChange={(checked) => updateSetting('crossSessionLearning', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-therapy-600" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="data-retention">Data Retention Period</Label>
                <Select 
                  value={settings.dataRetention} 
                  onValueChange={(value: AISettings['dataRetention']) => 
                    updateSetting('dataRetention', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Current Session Only</SelectItem>
                    <SelectItem value="week">1 Week</SelectItem>
                    <SelectItem value="month">1 Month</SelectItem>
                    <SelectItem value="permanent">Permanent (Until Deleted)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Encrypt Conversations</Label>
                    <p className="text-sm text-gray-500">End-to-end encryption for all chats</p>
                  </div>
                  <Switch
                    checked={settings.encryptConversations}
                    onCheckedChange={(checked) => updateSetting('encryptConversations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Share Anonymized Data</Label>
                    <p className="text-sm text-gray-500">Help improve AI for everyone</p>
                  </div>
                  <Switch
                    checked={settings.shareAnonymizedData}
                    onCheckedChange={(checked) => updateSetting('shareAnonymizedData', checked)}
                  />
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Privacy Guarantee</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your personal data is never shared with third parties. All processing 
                        happens securely, and you maintain full control over your information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Settings */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-therapy-600" />
                <span>Feature Toggles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center space-x-2">
                      <Brain className="h-4 w-4" />
                      <span>Contextual Awareness</span>
                    </Label>
                    <p className="text-sm text-gray-500">Understand situational context</p>
                  </div>
                  <Switch
                    checked={settings.contextualAwareness}
                    onCheckedChange={(checked) => updateSetting('contextualAwareness', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span>Mood Tracking</span>
                    </Label>
                    <p className="text-sm text-gray-500">Track and analyze mood patterns</p>
                  </div>
                  <Switch
                    checked={settings.moodTracking}
                    onCheckedChange={(checked) => updateSetting('moodTracking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Goal Integration</span>
                    </Label>
                    <p className="text-sm text-gray-500">Connect with your therapy goals</p>
                  </div>
                  <Switch
                    checked={settings.goalIntegration}
                    onCheckedChange={(checked) => updateSetting('goalIntegration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Crisis Detection</span>
                    </Label>
                    <p className="text-sm text-gray-500">Identify crisis situations</p>
                  </div>
                  <Switch
                    checked={settings.crisisDetection}
                    onCheckedChange={(checked) => updateSetting('crisisDetection', checked)}
                  />
                </div>
              </div>

              <div>
                <Label>Reminder Frequency</Label>
                <Select 
                  value={settings.reminderFrequency} 
                  onValueChange={(value: AISettings['reminderFrequency']) => 
                    updateSetting('reminderFrequency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Reminders</SelectItem>
                    <SelectItem value="daily">Daily Check-ins</SelectItem>
                    <SelectItem value="weekly">Weekly Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-therapy-600" />
                <span>Advanced Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="model-preference">AI Model Preference</Label>
                <Select 
                  value={settings.modelPreference} 
                  onValueChange={(value: AISettings['modelPreference']) => 
                    updateSetting('modelPreference', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                    <SelectItem value="creative">Creative & Intuitive</SelectItem>
                    <SelectItem value="analytical">Analytical & Logical</SelectItem>
                    <SelectItem value="therapeutic">Therapeutic Focused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Response Confidence Threshold: {settings.responseConfidenceThreshold}%</Label>
                <Slider
                  value={[settings.responseConfidenceThreshold]}
                  onValueChange={([value]) => updateSetting('responseConfidenceThreshold', value)}
                  max={100}
                  step={5}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum confidence level before the AI provides a response
                </p>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Advanced Settings Warning</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        These settings affect core AI behavior. Changes may impact your 
                        therapy experience. Proceed with caution.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISettingsConfiguration;