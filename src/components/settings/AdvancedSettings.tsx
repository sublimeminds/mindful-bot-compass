
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Zap, Shield, Database, Code, Save, AlertTriangle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdvancedSettings = () => {
  const { toast } = useToast();
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [verboseLogging, setVerboseLogging] = useState(false);
  const [sessionRecording, setSessionRecording] = useState(true);
  const [aiModelPreference, setAiModelPreference] = useState('balanced');
  const [responseDelay, setResponseDelay] = useState([1]);
  const [customPrompts, setCustomPrompts] = useState(false);
  const [userCustomPrompt, setUserCustomPrompt] = useState('');
  const [dataRetentionDays, setDataRetentionDays] = useState([365]);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(false);
  const [betaTesting, setBetaTesting] = useState(false);

  const aiModels = [
    { value: 'balanced', label: 'Balanced (Recommended)' },
    { value: 'creative', label: 'Creative & Exploratory' },
    { value: 'analytical', label: 'Analytical & Structured' },
    { value: 'empathetic', label: 'Highly Empathetic' },
    { value: 'solution_focused', label: 'Solution-Focused' }
  ];

  const handleSaveSettings = () => {
    localStorage.setItem('advancedSettings', JSON.stringify({
      experimentalFeatures,
      developerMode,
      verboseLogging,
      sessionRecording,
      aiModelPreference,
      responseDelay: responseDelay[0],
      customPrompts,
      userCustomPrompt,
      dataRetentionDays: dataRetentionDays[0],
      advancedAnalytics,
      betaTesting
    }));

    toast({
      title: "Advanced Settings Saved",
      description: "Your advanced preferences have been updated. Some changes may require a restart.",
    });
  };

  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to reset all your therapy data? This action cannot be undone.')) {
      // Clear all localStorage therapy data
      const keysToKeep = ['auth', 'theme', 'language'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
          localStorage.removeItem(key);
        }
      });

      toast({
        title: "Data Reset Complete",
        description: "All therapy data has been cleared. You can start fresh.",
        variant: "destructive"
      });
    }
  };

  const handleExportData = () => {
    // Collect all therapy-related data from localStorage
    const therapyData = {};
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (key.includes('therapy') || key.includes('session') || key.includes('mood') || key.includes('goal')) {
        try {
          therapyData[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch {
          therapyData[key] = localStorage.getItem(key);
        }
      }
    });

    // Create and download JSON file
    const dataBlob = new Blob([JSON.stringify(therapyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `therapy-data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported Successfully",
      description: "Your therapy data has been downloaded as a JSON file.",
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Advanced settings can affect app performance and behavior. Change these settings only if you understand their implications.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Experimental Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Experimental Features */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Experimental Features</Label>
              <p className="text-sm text-muted-foreground">
                Access cutting-edge features that are still in development
              </p>
            </div>
            <Switch
              checked={experimentalFeatures}
              onCheckedChange={setExperimentalFeatures}
            />
          </div>

          {/* Beta Testing */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Join Beta Testing Program</Label>
              <p className="text-sm text-muted-foreground">
                Help test new features and provide feedback
              </p>
            </div>
            <Switch
              checked={betaTesting}
              onCheckedChange={setBetaTesting}
            />
          </div>

          {/* Developer Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Developer Mode</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Show additional debugging information and controls
              </p>
            </div>
            <Switch
              checked={developerMode}
              onCheckedChange={setDeveloperMode}
            />
          </div>

          {/* Verbose Logging */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Verbose Logging</Label>
              <p className="text-sm text-muted-foreground">
                Enable detailed logging for troubleshooting
              </p>
            </div>
            <Switch
              checked={verboseLogging}
              onCheckedChange={setVerboseLogging}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Model Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Model Preference */}
          <div className="space-y-2">
            <Label>AI Model Preference</Label>
            <Select value={aiModelPreference} onValueChange={setAiModelPreference}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Response Delay */}
          <div className="space-y-3">
            <Label>AI Response Delay (seconds)</Label>
            <div className="space-y-2">
              <Slider
                value={responseDelay}
                onValueChange={setResponseDelay}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Current: {responseDelay[0]}s (Simulates natural conversation timing)
              </p>
            </div>
          </div>

          {/* Custom Prompts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Custom System Prompts</Label>
                <p className="text-sm text-muted-foreground">
                  Override default AI prompts with your own instructions
                </p>
              </div>
              <Switch
                checked={customPrompts}
                onCheckedChange={setCustomPrompts}
              />
            </div>

            {customPrompts && (
              <div className="space-y-2">
                <Label>Custom Prompt Instructions</Label>
                <Textarea
                  value={userCustomPrompt}
                  onChange={(e) => setUserCustomPrompt(e.target.value)}
                  placeholder="Enter custom instructions for the AI therapist..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  These instructions will be added to the AI's system prompt. Use responsibly.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Recording */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enhanced Session Recording</Label>
              <p className="text-sm text-muted-foreground">
                Record detailed session analytics and insights
              </p>
            </div>
            <Switch
              checked={sessionRecording}
              onCheckedChange={setSessionRecording}
            />
          </div>

          {/* Advanced Analytics */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Advanced Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Enable detailed behavioral and progress analytics
              </p>
            </div>
            <Switch
              checked={advancedAnalytics}
              onCheckedChange={setAdvancedAnalytics}
            />
          </div>

          {/* Data Retention */}
          <div className="space-y-3">
            <Label>Data Retention Period (days)</Label>
            <div className="space-y-2">
              <Slider
                value={dataRetentionDays}
                onValueChange={setDataRetentionDays}
                max={1095}
                min={30}
                step={30}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Current: {dataRetentionDays[0]} days ({Math.round(dataRetentionDays[0] / 30)} months)
              </p>
            </div>
          </div>

          {/* Data Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Button onClick={handleExportData} variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            
            <Button 
              onClick={handleResetAllData} 
              variant="destructive" 
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Advanced Settings
      </Button>
    </div>
  );
};

export default AdvancedSettings;
